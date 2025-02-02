# Proyecto GarraDragon

## Descripción del Proyecto
**GarraDragon** es un proyecto Backend que tiene como propósito solucionar la problemática que hay en los estudiantes de la ESFOT acerca de qué tipo de plan de aportación les conviene adquirir durante el semestre. Este backend permite la gestión de aportaciones a través de rutas públicas y privadas, permitiendo a los estudiantes visualizar los planes de aportaciones con sus respectivas características mediante archivos JSON.

## Metodología
La metodología aplicada en este proyecto fue la **metodología ágil SCRUM**, permitiendo completar a tiempo los Sprints organizados y cumplir con todos los objetivos.

## Resultados
### Sprint 0 - Configuración del Ambiente de Desarrollo
- **Delimitación de los requisitos a cumplir**
- **Estructura general de las carpetas del proyecto**
- **Diseño de las colecciones de datos para MongoDB**
- **Asignación de roles para cada usuario**

### Sprint 1 - Tesoreros
- **Creación de endpoint para el registro**
- **Creación de endpoint para el envío y verificación de email**
- **Creación de endpoints para el inicio de sesión**
- **Creación de endpoints para el restablecimiento de contraseña**
- **Creación de endpoints para la actualización del perfil**
- **Creación de endpoints para la actualización del password**

### Sprint 2 - Aportantes
- **Creación de endpoint para registrar aportantes**
- **Creación de endpoint para listar aportantes**
- **Creación de endpoint para visualizar el detalle de un aportante**
- **Creación de endpoint para actualizar aportantes**
- **Creación de endpoint para el login del aportante**
- **Creación de endpoint para visualizar el perfil del aportante**

### Sprint 3 - Aportaciones
- **Creación de endpoint para registrar aportaciones para un aportante**
- **Creación de endpoint para visualizar el detalle de una aportación**
- **Creación de endpoint para actualizar una aportación**
- **Creación de endpoint para eliminar una aportación**
- **Creación de endpoint para cambiar el estado de una aportación**
- **Creación de un endpoint para listar aportaciones asociados a un aportante**

### Sprint 4 - Pruebas
- **Prueba al Registro de Tesorero**
- **Prueba al revisar el detalle de un aportante**
- **Prueba al momento de actualizar una aportación**

### Sprint 5 - Despliegue
- **Enlace: [GarraDragon](https://garradragon.onrender.com)**

## Conclusiones
- **Problemas con claves duplicadas en la base de datos (Error E11000) y esquemas no registrados en Mongoose.**
- **Problemas al obtener el perfil de un aportante, posiblemente debido a datos nulos o mal estructurados en la autenticación.**
- **Depuración necesaria para corregir errores en consultas y modelos de datos.**

## Recomendaciones
- **Mejorar Validaciones en la Base de Datos**
  - Implementar validaciones en Mongoose para evitar valores nulos en campos clave como matrícula.
  - Definir índices únicos correctamente y manejar errores de duplicación de datos con lógica adecuada en el código.
- **Fortalecer la Autenticación y Control de Accesos**
  - Verificar que el middleware de autenticación maneje correctamente los tokens y sesiones.
  - Implementar registros de auditoría para detectar fallos en la autenticación o accesos indebidos.
- **Automatizar Pruebas y Monitoreo de la API**
  - Integrar pruebas automatizadas con Jest + Supertest para validar que cada endpoint funcione correctamente.
  - Usar herramientas como New Relic o LogRocket para monitorear el rendimiento y detectar errores en producción.
