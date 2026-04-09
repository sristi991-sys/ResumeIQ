import sys
import json
import joblib
import os
import re

# FAANG-level ATS NLP Dictionaries
ACTION_VERBS = [
    "architected", "engineered", "scaled", "optimized", "spearheaded", 
    "deployed", "mentored", "orchestrated", "refactored", "migrated", "redesigned"
]

IMPACT_METRICS = [
    r"%", r"\$", r"ms\b", r"latency", r"million", r"billion", r"users\b", r"qps", r"tps"
]

ADVANCED_SYSTEM_CONCEPTS = [
    "distributed systems", "microservices", "large-scale", "system design",
    "high availability", "fault tolerance", "concurrency", "load balancing", 
    "ci/cd", "kubernetes", "docker", "gcp", "aws", "azure", "kafka", "redis"
]

def extract_advanced_features(text_lower):
    # Regex counting
    verb_count = sum(1 for verb in ACTION_VERBS if re.search(r'\b' + verb + r'\b', text_lower))
    metric_count = sum(1 for metric in IMPACT_METRICS if re.search(metric, text_lower))
    system_concepts = [concept for concept in ADVANCED_SYSTEM_CONCEPTS if concept in text_lower]
    return verb_count, metric_count, system_concepts

def generate_faang_feedback(final_score, decision, matchedSkills, missingSkills, verb_count, metric_count, system_concepts, role):
    strengths = []
    weaknesses = []
    improvements = []
    
    # Strengths Formatting
    if metric_count >= 2:
        strengths.append(f"Demonstrates strong systemic impact through {metric_count} quantifiable metrics, aligning with data-driven engineering cultures.")
    if verb_count >= 2:
        strengths.append("Utilizes strong action-oriented terminology (e.g., 'architected', 'scaled'), indicating clear technical ownership and leadership.")
    if len(system_concepts) > 0:
        strengths.append(f"Exhibits proficiency in scalable architecture by highlighting experience with: {', '.join(system_concepts[:3])}.")
    
    if final_score >= 85:
        strengths.append("Overall technical profile strongly aligns with L4/L5 SWE expectations for problem-solving and domain expertise.")
    
    if not strengths:
        strengths.append("Possesses foundational technical knowledge for the specified role.")

    # Weaknesses Formatting
    if metric_count == 0:
        weaknesses.append("Lacks quantifiable impact metrics. High-tier evaluations require concrete numbers on performance improvements or user scale (e.g., 'reduced latency by 20ms').")
    if len(system_concepts) == 0 and "Engineer" in role:
        weaknesses.append("Missing evidence of working with complex, distributed systems or modern cloud-native architectures.")
    if len(missingSkills) > 0:
        weaknesses.append(f"Noticeable gaps in strict role requirements, specifically regarding: {', '.join(missingSkills[:3])}.")
        
    if not weaknesses:
        if final_score < 100:
            weaknesses.append("Could further elaborate on the cross-functional impact and systemic trade-offs made during system design.")

    # Improvements Formatting
    if metric_count < 2:
        improvements.append("Quantify your project outcomes using STAR methodology (Situation, Task, Action, Result). State the exact scale (QPS, data volume).")
    if verb_count < 2:
        improvements.append("Avoid passive language. Use authoritative action verbs to describe your direct engineering contributions.")
    for skill in missingSkills[:2]:
        improvements.append(f"Prioritize acquiring production-grade experience with {skill} to meet the structural requirements of this role.")
    
    return strengths, weaknesses, improvements

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments. Requires resume_file_path and role"}))
        sys.exit(1)
        
    resume_file_path = sys.argv[1]
    role = sys.argv[2]
    
    # Read resume text from the temp file safely!
    try:
        with open(resume_file_path, 'r', encoding='utf8') as f:
            resume_text = f.read()
    except Exception as e:
        print(json.dumps({"error": f"Failed to read resume temp file: {str(e)}"}))
        sys.exit(1)
    
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    vectorizer_path = os.path.join(BASE_DIR, 'tfidf_vectorizer.pkl')
    score_model_path = os.path.join(BASE_DIR, 'score_model.pkl')
    decision_model_path = os.path.join(BASE_DIR, 'decision_model.pkl')
    
    try:
        vectorizer = joblib.load(vectorizer_path)
        score_model = joblib.load(score_model_path)
        decision_model = joblib.load(decision_model_path)
    except Exception as e:
        print(json.dumps({"error": f"Failed to load models: {str(e)}"}))
        sys.exit(1)
        
    X_input = [resume_text + " " + role]
    try:
        X_vec = vectorizer.transform(X_input)
    except Exception as e:
        print(json.dumps({"error": f"Failed to vectorize input: {str(e)}"}))
        sys.exit(1)
        
    base_score = float(score_model.predict(X_vec)[0])
    base_decision = str(decision_model.predict(X_vec)[0])
    
    # NLP Parsing & Keyword Extraction
    text_lower = resume_text.lower()
    
    SKILLS_MAP = {
        "Software Engineer": ["python", "java", "react", "node.js", "c++", "kubernetes", "system design", "algorithms"],
        "Backend Developer": ["node.js", "python", "golang", "microservices", "mongodb", "postgresql", "redis", "docker"],
        "Frontend Developer": ["javascript", "typescript", "react", "next.js", "web performance", "css architecture"],
        "Data Scientist": ["python", "pytorch", "tensorflow", "nlp", "machine learning", "sql", "data pipelines"],
    }
    
    expected_skills = SKILLS_MAP.get(role, ["javascript", "python", "sql", "html", "react", "system design", "docker"])
    
    matchedSkills = []
    missingSkills = []
    for skill in expected_skills:
        if re.search(r'(?i)\b' + re.escape(skill) + r'\b', text_lower) or skill in text_lower:
            matchedSkills.append(skill)
        else:
            missingSkills.append(skill)
            
    # FAANG Feature Extraction
    verb_count, metric_count, system_concepts = extract_advanced_features(text_lower)
    
    # Dynamic Scoring adjustments based on FAANG parameters
    dynamic_score = base_score
    dynamic_score += (metric_count * 2) 
    dynamic_score += (len(system_concepts) * 2)
    dynamic_score -= (len(missingSkills) * 3)
    final_score = max(0, min(100, int(dynamic_score)))
    
    # Re-evaluate decision threshold for FAANG-level strictness
    if final_score >= 85 and metric_count >= 1:
        decision = "Selected"
    elif final_score >= 65:
        decision = "Borderline"
    else:
        decision = "Rejected"

    strengths, weaknesses, improvements = generate_faang_feedback(
        final_score, decision, matchedSkills, missingSkills, verb_count, metric_count, system_concepts, role
    )
    
    exp_level = "Beginner"
    if final_score > 65:
        exp_level = "Intermediate"
    if final_score > 85:
        exp_level = "Advanced"

    # Meta/Google style Reasoning
    reason = f"Candidate scored {final_score}/100. Evaluation utilized a strict ATS NLP model measuring semantic skill alignment, leadership vocabulary ({verb_count} action verbs), and quantifiable impact ({metric_count} metrics). The profile is deemed {decision.upper()} for high-velocity engineering environments."

    output = {
        "skillsExtracted": matchedSkills + system_concepts[:3],
        "matchedSkills": matchedSkills,
        "missingSkills": missingSkills,
        "experienceLevel": exp_level,
        "scores": {
            "skillMatch": int(min(100, (len(matchedSkills) / max(1, len(expected_skills))) * 100)),
            "experience": int(min(100, final_score + 5)),
            "projects": int(min(100, final_score - 5 + (metric_count * 5))),
            "finalScore": final_score
        },
        "decision": decision,
        "reason": reason,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvements": improvements
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    main()
