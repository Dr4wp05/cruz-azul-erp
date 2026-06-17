
## ☁️ Respaldos Automatizados en AWS S3 (Requisito 5)
Las copias de seguridad de la base de datos PostgreSQL (RDS) se generan cada 24 horas a través del script `backup.sh` incluido en este repositorio.

Los respaldos se almacenan de forma segura en el siguiente Bucket de Amazon S3:
* **Ruta del Bucket:** `s3://cruz-azul-respaldos-2026-rodriguez-parraguez/`

Para forzar un respaldo manual de la infraestructura, ejecute:
`bash backup.sh`
