output "backend_service_url" {
  description = "URL del servicio Backend alojado en AWS App Runner"
  value       = "https://${aws_apprunner_service.backend.service_url}"
}

output "database_endpoint" {
  description = "Endpoint de la base de datos PostgreSQL en RDS"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = true
}

output "database_address" {
  description = "Dirección host de PostgreSQL"
  value       = aws_db_instance.postgres.address
}

output "frontend_s3_bucket" {
  description = "Bucket S3 para el despliegue del Frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_website_url" {
  description = "URL del sitio web estático en S3"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}
