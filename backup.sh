#!/bin/bash

# Configuración
FECHA=$(date +%Y-%m-%d_%H-%M-%S)
ARCHIVO="backup_cruz_azul_$FECHA.sql"
BUCKET="s3://cruz-azul-respaldos-rodriguez-parraguez" 
ENDPOINT_RDS="cruz-azul-db.cr8s2ugi8ofk.us-east-1.rds.amazonaws.com" 

# 1. Extraer la copia
PGPASSWORD="CruzAzul2026#db" pg_dump -h $ENDPOINT_RDS -U postgres -d postgres -F c -f /tmp/$ARCHIVO

# 2. Subir a S3
aws s3 cp /tmp/$ARCHIVO $BUCKET/respaldos/

# 3. Limpiar
rm /tmp/$ARCHIVO
