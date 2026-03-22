-- Initial schema migration for GetCyberRight
-- Generated from shared/schema.ts and shared/models/auth.ts

-- Sessions table (express-session)
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar PRIMARY KEY NOT NULL,
  "sess" jsonb NOT NULL,
  "expire" timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Users table (custom email/password auth with MFA)
CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password_hash" text,
  "first_name" varchar,
  "last_name" varchar,
  "profile_image_url" varchar,
  "email_verified" boolean DEFAULT false,
  "email_verification_token" varchar,
  "email_verification_expires" timestamp,
  "password_reset_token" varchar,
  "password_reset_expires" timestamp,
  "mfa_enabled" boolean DEFAULT false,
  "mfa_secret" varchar,
  "mfa_backup_codes" text,
  "failed_login_attempts" varchar DEFAULT '0',
  "locked_until" timestamp,
  "last_login_at" timestamp,
  "last_login_ip" varchar,
  "must_change_password" boolean DEFAULT false,
  "subscription_tier" varchar DEFAULT 'free',
  "subscription_expires_at" timestamp,
  "stripe_customer_id" varchar,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- User Progress (gamification)
CREATE TABLE IF NOT EXISTS "user_progress" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "total_points" integer DEFAULT 0,
  "level" integer DEFAULT 1,
  "scans_completed" integer DEFAULT 0,
  "lessons_completed" integer DEFAULT 0,
  "current_streak" integer DEFAULT 0,
  "longest_streak" integer DEFAULT 0,
  "last_activity_date" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Badge Definitions (gamification)
CREATE TABLE IF NOT EXISTS "badge_definitions" (
  "id" varchar PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "tier" text NOT NULL,
  "requirement" text NOT NULL,
  "points" integer DEFAULT 0,
  "icon_name" text
);

-- User Earned Badges (gamification)
CREATE TABLE IF NOT EXISTS "user_badges" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "badge_id" varchar NOT NULL,
  "earned_at" timestamp DEFAULT now(),
  "progress" integer DEFAULT 0,
  "max_progress" integer DEFAULT 1
);

-- Family Codewords
CREATE TABLE IF NOT EXISTS "family_codewords" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "codeword" text NOT NULL,
  "style" text NOT NULL,
  "family_name" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Audio Analysis History
CREATE TABLE IF NOT EXISTS "audio_analysis_history" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar,
  "file_name" text,
  "file_size" integer,
  "is_deepfake" boolean,
  "confidence" integer,
  "risk_level" text,
  "analysis_result" text,
  "created_at" timestamp DEFAULT now()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "category" text NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text UNIQUE NOT NULL,
  "is_active" boolean DEFAULT true,
  "preferences" text[],
  "created_at" timestamp DEFAULT now()
);

-- Experience Waitlist
CREATE TABLE IF NOT EXISTS "experience_waitlist" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "name" text,
  "type" text NOT NULL DEFAULT 'family',
  "created_at" timestamp DEFAULT now()
);

-- Conversations
CREATE TABLE IF NOT EXISTS "conversations" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL DEFAULT 'New Chat',
  "session_id" text,
  "created_at" timestamp DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS "messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "conversation_id" integer NOT NULL,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);

-- Newsletter Issues
CREATE TABLE IF NOT EXISTS "newsletter_issues" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "subject" text NOT NULL,
  "content_html" text NOT NULL,
  "content_text" text NOT NULL,
  "threat_summary" text,
  "protection_tip" text,
  "family_topic" text,
  "quick_wins" text[],
  "status" text NOT NULL DEFAULT 'draft',
  "scheduled_for" timestamp,
  "sent_at" timestamp,
  "recipient_count" integer DEFAULT 0,
  "open_count" integer DEFAULT 0,
  "click_count" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Scam Reports
CREATE TABLE IF NOT EXISTS "scam_reports" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "scam_type" text NOT NULL,
  "description" text NOT NULL,
  "scammer_contact" text,
  "amount_lost" text,
  "reporter_email" text,
  "anonymous" text DEFAULT 'true',
  "created_at" timestamp DEFAULT now()
);

-- Tool Usage Analytics
CREATE TABLE IF NOT EXISTS "tool_usage" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tool_name" text NOT NULL,
  "user_id" varchar,
  "session_id" varchar,
  "country_code" varchar(2),
  "completed" boolean DEFAULT false,
  "metadata" text,
  "created_at" timestamp DEFAULT now()
);

-- Threat Feeds
CREATE TABLE IF NOT EXISTS "threat_feeds" (
  "id" varchar PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "source_url" text NOT NULL,
  "source_type" text NOT NULL,
  "category" text NOT NULL,
  "priority" integer DEFAULT 5,
  "schedule_interval" integer DEFAULT 3600,
  "is_active" boolean DEFAULT true,
  "requires_auth" boolean DEFAULT false,
  "auth_config" text,
  "parser_config" text,
  "last_successful_run" timestamp,
  "last_attempted_run" timestamp,
  "last_error" text,
  "item_count" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Feed Runs
CREATE TABLE IF NOT EXISTS "feed_runs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "feed_id" varchar NOT NULL,
  "status" text NOT NULL,
  "started_at" timestamp DEFAULT now(),
  "completed_at" timestamp,
  "items_ingested" integer DEFAULT 0,
  "items_updated" integer DEFAULT 0,
  "items_skipped" integer DEFAULT 0,
  "error_message" text,
  "duration_ms" integer,
  "triggered_by" text DEFAULT 'scheduler'
);

-- Threat Items
CREATE TABLE IF NOT EXISTS "threat_items" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "feed_id" varchar NOT NULL,
  "external_id" text,
  "content_hash" text,
  "item_type" text NOT NULL,
  "title" text NOT NULL,
  "summary" text,
  "content" text,
  "severity" text,
  "confidence" integer,
  "regions" text,
  "tags" text,
  "indicators" text,
  "affected_audiences" text,
  "source_url" text,
  "published_at" timestamp,
  "expires_at" timestamp,
  "ingested_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "is_active" boolean DEFAULT true
);

-- Content Refresh Mappings
CREATE TABLE IF NOT EXISTS "content_refresh_mappings" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "threat_item_id" varchar NOT NULL,
  "content_type" text NOT NULL,
  "content_path" text NOT NULL,
  "last_refreshed" timestamp DEFAULT now(),
  "auto_update" boolean DEFAULT true
);

-- Feed Health Alerts
CREATE TABLE IF NOT EXISTS "feed_health_alerts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "feed_id" varchar NOT NULL,
  "alert_type" text NOT NULL,
  "severity" text NOT NULL,
  "message" text NOT NULL,
  "acknowledged_at" timestamp,
  "resolved_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Content Pages Registry
CREATE TABLE IF NOT EXISTS "content_pages" (
  "id" varchar PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "path" text NOT NULL,
  "section" text NOT NULL,
  "audience" text NOT NULL,
  "topics" text[] NOT NULL,
  "last_manual_update" timestamp,
  "freshness_score" integer DEFAULT 100,
  "priority_level" text DEFAULT 'normal',
  "needs_review" boolean DEFAULT false,
  "review_reason" text,
  "related_threat_count" integer DEFAULT 0,
  "last_threat_match" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Content Audit Log
CREATE TABLE IF NOT EXISTS "content_audit_log" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "page_id" varchar NOT NULL,
  "action" text NOT NULL,
  "triggered_by" text NOT NULL,
  "threat_item_id" varchar,
  "notes" text,
  "previous_score" integer,
  "new_score" integer,
  "performed_by" varchar,
  "created_at" timestamp DEFAULT now()
);

-- Compliance Control Families (NIST 800-53)
CREATE TABLE IF NOT EXISTS "compliance_control_families" (
  "id" varchar PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "total_controls" integer DEFAULT 0,
  "implemented_controls" integer DEFAULT 0,
  "partial_controls" integer DEFAULT 0,
  "not_applicable_controls" integer DEFAULT 0,
  "compliance_score" integer DEFAULT 0,
  "priority" text DEFAULT 'medium',
  "last_assessment" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Compliance Controls (NIST 800-53)
CREATE TABLE IF NOT EXISTS "compliance_controls" (
  "id" varchar PRIMARY KEY NOT NULL,
  "family_id" varchar NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "implementation_status" text DEFAULT 'not_implemented',
  "priority" text DEFAULT 'moderate',
  "evidence" text,
  "platform_features" text,
  "gaps" text,
  "recommendations" text,
  "last_assessment" timestamp,
  "assessed_by" varchar,
  "notes" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Compliance Assessments
CREATE TABLE IF NOT EXISTS "compliance_assessments" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "assessment_type" text NOT NULL,
  "target_id" varchar,
  "overall_score" integer,
  "implemented_count" integer DEFAULT 0,
  "partial_count" integer DEFAULT 0,
  "gaps_count" integer DEFAULT 0,
  "summary" text,
  "performed_by" varchar,
  "created_at" timestamp DEFAULT now()
);

-- Learning Paths
CREATE TABLE IF NOT EXISTS "learning_paths" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "audience" text NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "level" text NOT NULL,
  "estimated_hours" integer DEFAULT 3,
  "prerequisites" text[],
  "learning_outcomes" text[],
  "certificate_name" text,
  "icon_name" text,
  "color" text,
  "sort_order" integer DEFAULT 0,
  "is_published" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Training Modules
CREATE TABLE IF NOT EXISTS "training_modules" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "path_id" varchar NOT NULL,
  "domain" text NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "learning_objectives" text[],
  "estimated_minutes" integer DEFAULT 30,
  "sort_order" integer DEFAULT 0,
  "is_published" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Training Lessons
CREATE TABLE IF NOT EXISTS "training_lessons" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "module_id" varchar NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "content_type" text NOT NULL,
  "content_html" text,
  "video_url" text,
  "scenario_data" text,
  "key_takeaways" text[],
  "estimated_minutes" integer DEFAULT 10,
  "sort_order" integer DEFAULT 0,
  "is_published" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Training Quizzes
CREATE TABLE IF NOT EXISTS "training_quizzes" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "module_id" varchar NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "passing_score" integer DEFAULT 70,
  "max_attempts" integer DEFAULT 3,
  "time_limit" integer,
  "shuffle_questions" boolean DEFAULT true,
  "show_correct_answers" boolean DEFAULT true,
  "is_published" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Quiz Questions
CREATE TABLE IF NOT EXISTS "quiz_questions" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "quiz_id" varchar NOT NULL,
  "question_type" text NOT NULL,
  "question_text" text NOT NULL,
  "options" text[],
  "correct_answer" text NOT NULL,
  "explanation" text,
  "scenario_context" text,
  "difficulty" text DEFAULT 'medium',
  "points" integer DEFAULT 10,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

-- User Learning Progress
CREATE TABLE IF NOT EXISTS "user_learning_progress" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "path_id" varchar,
  "module_id" varchar,
  "lesson_id" varchar,
  "status" text NOT NULL DEFAULT 'not_started',
  "progress_percent" integer DEFAULT 0,
  "time_spent_minutes" integer DEFAULT 0,
  "started_at" timestamp,
  "completed_at" timestamp,
  "last_accessed_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS "quiz_attempts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "quiz_id" varchar NOT NULL,
  "score" integer NOT NULL,
  "max_score" integer NOT NULL,
  "percent_score" integer NOT NULL,
  "passed" boolean NOT NULL,
  "answers" text,
  "time_spent_seconds" integer,
  "attempt_number" integer DEFAULT 1,
  "completed_at" timestamp DEFAULT now()
);

-- Training Certificates
CREATE TABLE IF NOT EXISTS "training_certificates" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "path_id" varchar NOT NULL,
  "certificate_name" text NOT NULL,
  "certificate_number" text NOT NULL,
  "issue_date" timestamp DEFAULT now(),
  "expiry_date" timestamp,
  "final_score" integer,
  "verification_url" text,
  "pdf_url" text,
  "created_at" timestamp DEFAULT now()
);

-- Data Brokers
CREATE TABLE IF NOT EXISTS "data_brokers" (
  "id" varchar PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "domain" text NOT NULL,
  "description" text,
  "category" text NOT NULL,
  "data_types_collected" text[],
  "opt_out_method" text NOT NULL,
  "opt_out_url" text,
  "opt_out_email" text,
  "opt_out_mail_address" text,
  "opt_out_phone" text,
  "opt_out_instructions" text,
  "difficulty" text NOT NULL DEFAULT 'medium',
  "estimated_processing_days" integer DEFAULT 30,
  "requires_id_verification" boolean DEFAULT false,
  "requires_account_creation" boolean DEFAULT false,
  "legal_basis" text[],
  "countries_applicable" text[],
  "risk_level" text DEFAULT 'medium',
  "monthly_visitors" text,
  "parent_company" text,
  "related_brokers" text[],
  "automation_feasibility" text DEFAULT 'manual',
  "privacy_policy_url" text,
  "data_retention_policy" text,
  "verification_method" text,
  "last_verified_by" text,
  "source_version" integer DEFAULT 1,
  "is_active" boolean DEFAULT true,
  "last_verified" timestamp,
  "last_process_change" timestamp,
  "avg_response_days" integer,
  "difficulty_rating" integer DEFAULT 5,
  "success_rate" integer,
  "total_removal_requests" integer DEFAULT 0,
  "total_successful_removals" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- User Vault Profiles
CREATE TABLE IF NOT EXISTS "user_vault_profiles" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "profile_name" text NOT NULL DEFAULT 'Primary',
  "full_name" text,
  "previous_names" text[],
  "emails" text[],
  "phone_numbers" text[],
  "current_address" text,
  "previous_addresses" text[],
  "date_of_birth" text,
  "relative_names" text[],
  "employer_names" text[],
  "data_minimized" boolean DEFAULT false,
  "retention_expires_at" timestamp,
  "last_accessed_at" timestamp,
  "is_active" boolean DEFAULT true,
  "privacy_mode" text DEFAULT 'standard',
  "priority_level" text DEFAULT 'normal',
  "compliance_frameworks" text[],
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Exposure Scans
CREATE TABLE IF NOT EXISTS "exposure_scans" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "vault_profile_id" varchar NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "total_brokers_scanned" integer DEFAULT 0,
  "total_exposures_found" integer DEFAULT 0,
  "privacy_score" integer,
  "risk_level" text,
  "identity_risk_score" integer,
  "breach_count" integer DEFAULT 0,
  "profiles_discovered" integer DEFAULT 0,
  "active_brokers_found" integer DEFAULT 0,
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Exposure Findings
CREATE TABLE IF NOT EXISTS "exposure_findings" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "scan_id" varchar NOT NULL,
  "user_id" varchar NOT NULL,
  "broker_id" varchar NOT NULL,
  "data_types_exposed" text[],
  "exposure_level" text DEFAULT 'medium',
  "verification_method" text DEFAULT 'broker_analysis',
  "verification_details" text,
  "confidence_score" integer DEFAULT 0,
  "source_evidence" text,
  "detected_at" timestamp DEFAULT now()
);

-- Removal Requests
CREATE TABLE IF NOT EXISTS "removal_requests" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "broker_id" varchar NOT NULL,
  "vault_profile_id" varchar NOT NULL,
  "finding_id" varchar,
  "status" text NOT NULL DEFAULT 'not_started',
  "request_method" text,
  "request_content" text,
  "request_sent_at" timestamp,
  "follow_up_count" integer DEFAULT 0,
  "max_follow_ups" integer DEFAULT 3,
  "last_follow_up_at" timestamp,
  "confirmed_removed_at" timestamp,
  "re_appeared_at" timestamp,
  "retry_count" integer DEFAULT 0,
  "max_retries" integer DEFAULT 3,
  "last_error" text,
  "next_retry_at" timestamp,
  "escalation_level" integer DEFAULT 0,
  "jurisdiction_applied" text,
  "legal_basis_used" text,
  "compliance_deadline" timestamp,
  "verification_required" boolean DEFAULT false,
  "verification_completed_at" timestamp,
  "change_detected_at" timestamp,
  "last_checked_at" timestamp,
  "compliance_status" text DEFAULT 'pending',
  "response_received_at" timestamp,
  "regulatory_deadline_days" integer,
  "is_overdue" boolean DEFAULT false,
  "non_compliance_reported" boolean DEFAULT false,
  "non_compliance_reported_at" timestamp,
  "proof_of_removal" text,
  "removal_evidence" text[],
  "notes" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Monitoring Schedules
CREATE TABLE IF NOT EXISTS "monitoring_schedules" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "vault_profile_id" varchar NOT NULL,
  "frequency_days" integer DEFAULT 90,
  "next_scan_date" timestamp,
  "last_scan_date" timestamp,
  "last_run_status" text,
  "last_run_error" text,
  "total_reappearances" integer DEFAULT 0,
  "consecutive_failures" integer DEFAULT 0,
  "is_active" boolean DEFAULT true,
  "total_scans_completed" integer DEFAULT 0,
  "auto_re_removal" boolean DEFAULT false,
  "auto_re_removal_count" integer DEFAULT 0,
  "notify_on_new_exposure" boolean DEFAULT true,
  "notify_on_re_appearance" boolean DEFAULT true,
  "notify_on_compliance_deadline" boolean DEFAULT true,
  "monitoring_mode" text DEFAULT 'periodic',
  "dark_web_monitoring" boolean DEFAULT false,
  "alert_threshold_new_exposures" integer DEFAULT 1,
  "alert_threshold_risk_score" integer DEFAULT 70,
  "reindex_detection" boolean DEFAULT true,
  "last_risk_score" integer,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Privacy Reports
CREATE TABLE IF NOT EXISTS "privacy_reports" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "scan_id" varchar,
  "privacy_score" integer NOT NULL,
  "total_brokers_checked" integer DEFAULT 0,
  "total_exposures" integer DEFAULT 0,
  "total_removed" integer DEFAULT 0,
  "total_in_progress" integer DEFAULT 0,
  "total_pending" integer DEFAULT 0,
  "category_breakdown" text,
  "risk_assessment" text,
  "recommendations" text[],
  "created_at" timestamp DEFAULT now()
);

-- Opt-Out Content
CREATE TABLE IF NOT EXISTS "opt_out_content" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "broker_id" varchar NOT NULL,
  "removal_request_id" varchar,
  "regulatory_framework" text NOT NULL DEFAULT 'CCPA',
  "template_type" text NOT NULL DEFAULT 'deletion_request',
  "subject" text,
  "body" text NOT NULL,
  "legal_citations" text[],
  "attachment_descriptions" text[],
  "delivery_method" text DEFAULT 'email',
  "sent_at" timestamp,
  "sent_to" text,
  "response_received_at" timestamp,
  "response_content" text,
  "status" text NOT NULL DEFAULT 'draft',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Removal Audit Log
CREATE TABLE IF NOT EXISTS "removal_audit_log" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar,
  "action" text NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" varchar,
  "previous_state" text,
  "new_state" text,
  "metadata" jsonb,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamp DEFAULT now()
);

-- Removal Verifications
CREATE TABLE IF NOT EXISTS "removal_verifications" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "removal_request_id" varchar NOT NULL,
  "broker_id" varchar NOT NULL,
  "verification_type" text NOT NULL DEFAULT 're_scan',
  "status" text NOT NULL DEFAULT 'pending',
  "data_still_present" boolean,
  "evidence_url" text,
  "evidence_screenshot" text,
  "notes" text,
  "scheduled_for" timestamp,
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Broker Walkthroughs
CREATE TABLE IF NOT EXISTS "broker_walkthroughs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "broker_id" varchar NOT NULL,
  "broker_name" text NOT NULL,
  "difficulty" text NOT NULL DEFAULT 'medium',
  "estimated_minutes" integer DEFAULT 5,
  "requires_captcha" boolean DEFAULT false,
  "requires_account" boolean DEFAULT false,
  "requires_id" boolean DEFAULT false,
  "requires_phone" boolean DEFAULT false,
  "opt_out_url" text,
  "steps" jsonb NOT NULL,
  "tips" text[],
  "last_verified" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Security Alerts
CREATE TABLE IF NOT EXISTS "security_alerts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "severity" varchar(20) NOT NULL DEFAULT 'medium',
  "category" varchar(50) NOT NULL DEFAULT 'advisory',
  "source" varchar(100) NOT NULL,
  "source_url" text NOT NULL,
  "affected_systems" text,
  "recommendations" text,
  "is_read" boolean DEFAULT false,
  "published_at" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now()
);

-- Breach Monitoring Subscriptions
CREATE TABLE IF NOT EXISTS "breach_monitoring_subscriptions" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "email" varchar(255) NOT NULL,
  "monitored_emails" text[],
  "is_active" boolean DEFAULT true,
  "unsubscribe_token" varchar(100),
  "last_checked_at" timestamp,
  "total_breaches_found" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

-- Breach Check Results
CREATE TABLE IF NOT EXISTS "breach_check_results" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "email" varchar(255) NOT NULL,
  "subscription_id" integer,
  "breach_name" varchar(255) NOT NULL,
  "breach_domain" varchar(255),
  "breach_date" timestamp,
  "exposed_data_types" text[],
  "severity" varchar(20) DEFAULT 'medium',
  "is_password_exposed" boolean DEFAULT false,
  "is_notified" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

-- Profile Discoveries
CREATE TABLE IF NOT EXISTS "profile_discoveries" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar,
  "scan_id" varchar,
  "broker_id" varchar NOT NULL,
  "profile_url" text,
  "search_method" text NOT NULL,
  "name_match" boolean DEFAULT false,
  "city_match" boolean DEFAULT false,
  "state_match" boolean DEFAULT false,
  "age_match" boolean DEFAULT false,
  "match_score" integer DEFAULT 0,
  "extracted_name" text,
  "extracted_city" text,
  "extracted_state" text,
  "extracted_age" text,
  "extracted_relatives" text[],
  "raw_snippet" text,
  "response_time_ms" integer,
  "is_confirmed_match" boolean DEFAULT false,
  "status" text NOT NULL DEFAULT 'found',
  "created_at" timestamp DEFAULT now()
);

-- Broker Performance
CREATE TABLE IF NOT EXISTS "broker_performance" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "broker_id" varchar NOT NULL,
  "total_requests" integer DEFAULT 0,
  "successful_removals" integer DEFAULT 0,
  "failed_removals" integer DEFAULT 0,
  "average_removal_days" integer,
  "reappearance_count" integer DEFAULT 0,
  "reappearance_rate" integer DEFAULT 0,
  "last_success_at" timestamp,
  "last_failure_at" timestamp,
  "fingerprint" text,
  "best_method" text,
  "common_failure_reasons" text[],
  "avg_response_time_days" integer,
  "compliance_rate" integer DEFAULT 100,
  "updated_at" timestamp DEFAULT now()
);

-- AI Prompts
CREATE TABLE IF NOT EXISTS "ai_prompts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text UNIQUE NOT NULL,
  "title" text NOT NULL,
  "prompt_text" text NOT NULL,
  "audience" text[] NOT NULL,
  "category" text NOT NULL,
  "tags" text[] NOT NULL,
  "use_case" text NOT NULL,
  "safety_note" text,
  "icon_name" text NOT NULL,
  "is_active" boolean DEFAULT true,
  "version" integer DEFAULT 1,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Prompt Reviews
CREATE TABLE IF NOT EXISTS "prompt_reviews" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "prompt_id" varchar,
  "review_type" text NOT NULL,
  "proposed_title" text,
  "proposed_prompt_text" text,
  "proposed_tags" text[],
  "proposed_use_case" text,
  "proposed_safety_note" text,
  "proposed_audience" text[],
  "proposed_category" text,
  "proposed_icon_name" text,
  "rationale" text,
  "quality_score" integer,
  "ai_model" text,
  "status" text NOT NULL DEFAULT 'pending',
  "review_run_id" varchar,
  "reviewed_by" varchar,
  "reviewed_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Prompt Review Runs
CREATE TABLE IF NOT EXISTS "prompt_review_runs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "status" text NOT NULL DEFAULT 'running',
  "trigger_type" text NOT NULL,
  "prompts_reviewed" integer DEFAULT 0,
  "improvements_suggested" integer DEFAULT 0,
  "new_prompts_suggested" integer DEFAULT 0,
  "summary" text,
  "error_message" text,
  "started_at" timestamp DEFAULT now(),
  "completed_at" timestamp
);

-- Platform Announcements
CREATE TABLE IF NOT EXISTS "platform_announcements" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "type" text NOT NULL DEFAULT 'update',
  "priority" text NOT NULL DEFAULT 'normal',
  "link_url" text,
  "link_text" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "starts_at" timestamp,
  "expires_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Trending Threats
CREATE TABLE IF NOT EXISTS "trending_threats" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "source" text NOT NULL,
  "category" text NOT NULL DEFAULT 'scam',
  "severity" text NOT NULL DEFAULT 'high',
  "link_url" text,
  "regions" text[] NOT NULL DEFAULT ARRAY['GLOBAL']::text[],
  "audience" text NOT NULL DEFAULT 'general',
  "is_active" boolean NOT NULL DEFAULT true,
  "is_auto_generated" boolean NOT NULL DEFAULT false,
  "display_order" integer NOT NULL DEFAULT 0,
  "expires_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- User Feedback
CREATE TABLE IF NOT EXISTS "user_feedback" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category" text NOT NULL,
  "message" text NOT NULL,
  "email" text,
  "page" text,
  "status" text NOT NULL DEFAULT 'new',
  "admin_notes" text,
  "user_agent" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Cyber Safety Guides
CREATE TABLE IF NOT EXISTS "cyber_safety_guides" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" varchar(255) UNIQUE NOT NULL,
  "title" text NOT NULL,
  "meta_description" text NOT NULL,
  "content" text NOT NULL,
  "headings" jsonb DEFAULT '[]'::jsonb,
  "table_of_contents" jsonb DEFAULT '[]'::jsonb,
  "faq" jsonb DEFAULT '[]'::jsonb,
  "category" text NOT NULL,
  "tags" text[] DEFAULT '{}',
  "target_keywords" text[] DEFAULT '{}',
  "cluster" text,
  "word_count" integer DEFAULT 0,
  "reading_time_minutes" integer DEFAULT 0,
  "status" text NOT NULL DEFAULT 'draft',
  "published_at" timestamp,
  "author_name" text DEFAULT 'GetCyberRight Team',
  "featured_image" text,
  "related_guide_ids" text[] DEFAULT '{}',
  "related_scam_slugs" text[] DEFAULT '{}',
  "related_tool_paths" text[] DEFAULT '{}',
  "seo_score" integer DEFAULT 0,
  "generated_by_ai" boolean DEFAULT false,
  "ai_model" text,
  "last_ai_review_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Scam Intelligence
CREATE TABLE IF NOT EXISTS "scam_intelligence" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" varchar(255) UNIQUE NOT NULL,
  "scam_name" text NOT NULL,
  "scam_category" text NOT NULL,
  "platform_used" text[] DEFAULT '{}',
  "target_audience" text[] DEFAULT '{}',
  "example_messages" jsonb DEFAULT '[]'::jsonb,
  "warning_signs" text[] DEFAULT '{}',
  "prevention_tips" text[] DEFAULT '{}',
  "how_it_works" jsonb DEFAULT '[]'::jsonb,
  "risk_level" text NOT NULL DEFAULT 'medium',
  "meta_description" text,
  "faq" jsonb DEFAULT '[]'::jsonb,
  "related_scam_slugs" text[] DEFAULT '{}',
  "regions" text[] DEFAULT '{}',
  "report_count" integer DEFAULT 0,
  "average_loss" text,
  "date_detected" timestamp DEFAULT now(),
  "last_updated" timestamp DEFAULT now(),
  "status" text NOT NULL DEFAULT 'draft',
  "generated_by_ai" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

-- Cyber Threat Alerts
CREATE TABLE IF NOT EXISTS "cyber_threat_alerts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" varchar(255) UNIQUE NOT NULL,
  "threat_name" text NOT NULL,
  "threat_category" text NOT NULL,
  "description" text NOT NULL,
  "detailed_analysis" text,
  "risk_level" text NOT NULL DEFAULT 'medium',
  "affected_platforms" text[] DEFAULT '{}',
  "indicators" jsonb DEFAULT '[]'::jsonb,
  "mitigation_steps" text[] DEFAULT '{}',
  "source_urls" text[] DEFAULT '{}',
  "cve_ids" text[] DEFAULT '{}',
  "regions" text[] DEFAULT '{}',
  "target_audience" text DEFAULT 'general',
  "meta_description" text,
  "related_alert_ids" text[] DEFAULT '{}',
  "related_guide_slugs" text[] DEFAULT '{}',
  "status" text NOT NULL DEFAULT 'draft',
  "published_at" timestamp,
  "expires_at" timestamp,
  "source_type" text,
  "generated_by_ai" boolean DEFAULT false,
  "date_detected" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Social Posts
CREATE TABLE IF NOT EXISTS "social_posts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "content_type" text NOT NULL,
  "content_id" varchar NOT NULL,
  "content_title" text NOT NULL,
  "platform" text NOT NULL,
  "post_content" text NOT NULL,
  "hashtags" text[] DEFAULT '{}',
  "image_url" text,
  "scheduled_at" timestamp,
  "published_at" timestamp,
  "status" text NOT NULL DEFAULT 'draft',
  "publish_error" text,
  "engagement_metrics" jsonb,
  "created_at" timestamp DEFAULT now()
);

-- Growth Tasks
CREATE TABLE IF NOT EXISTS "growth_tasks" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "task_type" text NOT NULL,
  "task_name" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "priority" text NOT NULL DEFAULT 'normal',
  "payload" jsonb,
  "result" jsonb,
  "error_message" text,
  "scheduled_at" timestamp,
  "started_at" timestamp,
  "completed_at" timestamp,
  "retry_count" integer DEFAULT 0,
  "max_retries" integer DEFAULT 3,
  "created_at" timestamp DEFAULT now()
);

-- Platform Metrics
CREATE TABLE IF NOT EXISTS "platform_metrics" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "metric_date" timestamp NOT NULL,
  "articles_published" integer DEFAULT 0,
  "keywords_covered" integer DEFAULT 0,
  "scam_pages_generated" integer DEFAULT 0,
  "alerts_generated" integer DEFAULT 0,
  "social_posts_created" integer DEFAULT 0,
  "subscriber_count" integer DEFAULT 0,
  "subscriber_growth" integer DEFAULT 0,
  "total_page_views" integer DEFAULT 0,
  "tool_usage_count" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

-- Threat Stats
CREATE TABLE IF NOT EXISTS "threat_stats" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "stat_key" varchar(100) UNIQUE NOT NULL,
  "value" text NOT NULL,
  "label" text NOT NULL,
  "description" text,
  "source" text,
  "source_url" text,
  "category" text,
  "color_theme" text,
  "display_order" integer DEFAULT 0,
  "report_year" integer,
  "updated_at" timestamp DEFAULT now()
);

-- Age Group Stats
CREATE TABLE IF NOT EXISTS "age_group_stats" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "age_group" text NOT NULL,
  "percentage" integer NOT NULL,
  "color_class" text,
  "display_order" integer DEFAULT 0,
  "source" text
);

-- Regional Attack Types
CREATE TABLE IF NOT EXISTS "regional_attack_types" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "region" text NOT NULL,
  "attack_types" text NOT NULL,
  "color_class" text,
  "display_order" integer DEFAULT 0,
  "source" text
);

-- Scan History
CREATE TABLE IF NOT EXISTS "scan_history" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "content_snippet" text NOT NULL,
  "content_type" text NOT NULL,
  "risk_level" text NOT NULL,
  "risk_score" integer DEFAULT 0,
  "result_summary" text,
  "flags_found" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

-- Community Scam Reports
CREATE TABLE IF NOT EXISTS "community_scam_reports" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "content" text NOT NULL,
  "report_type" text NOT NULL,
  "url" text,
  "votes" integer DEFAULT 1,
  "status" text DEFAULT 'pending',
  "reporter_session_id" varchar,
  "created_at" timestamp DEFAULT now()
);

-- Scan Reports
CREATE TABLE IF NOT EXISTS "scan_reports" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "share_id" varchar NOT NULL,
  "content_snippet" text NOT NULL,
  "content_type" text NOT NULL,
  "risk_level" text NOT NULL,
  "risk_score" integer DEFAULT 0,
  "result_summary" text,
  "flags_found" integer DEFAULT 0,
  "flag_details" text,
  "ai_analysis" text,
  "created_at" timestamp DEFAULT now()
);

-- Scam of the Week
CREATE TABLE IF NOT EXISTS "scam_of_week" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "scam_type" text NOT NULL,
  "tips" text NOT NULL,
  "example_message" text,
  "severity" text DEFAULT 'high',
  "week_start" timestamp NOT NULL,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now()
);
