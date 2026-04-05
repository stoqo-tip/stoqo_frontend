# Stoqo Frontend

Frontend mobile Android de Stoqo, desarrollado con React Native CLI y TypeScript.

El proyecto corre como app nativa Android con soporte para escaneo de codigos de barras usando Google ML Kit a traves de `react-native-vision-camera`.

## Stack actual

- React Native CLI
- TypeScript
- React Native Vision Camera
- Google ML Kit Barcode Scanning

## Tecnologias extra que hubo que instalar

- Node.js 22 LTS (versiones superiores no son compatibles con React Native)
- Java 21 (React Native 0.84 no es compatible con Java 22+)
- Android Studio (incluye SDK Manager y emulador)
- Android SDK con NDK 27.1.12297006 (versiones anteriores del NDK rompen el build de C++)
- Android SDK Platform-Tools (`adb`)
- React Native Vision Camera (`react-native-vision-camera`)
- Google ML Kit Barcode Scanning habilitado en Android via `VisionCamera_enableCodeScanner=true`

## Requisitos

- Node.js 22 LTS
- Java 21
- Android Studio con SDK instalado
- NDK 27.1.12297006 instalado via SDK Manager
- `adb` disponible en `PATH`
- Celular Android con depuracion USB habilitada o emulador Android

## Instalar dependencias

```bash
cd app
npm install
```

## Correr el servidor de desarrollo

```bash
cd app
npm start
```

## Instalar y ejecutar la app en Android

En otra terminal:

```bash
cd app
npm run android
```

## Probar en celular fisico

1. Activar `Opciones de desarrollador`
2. Activar `Depuracion por USB`
3. Conectar el celular por USB
4. Verificar que `adb` vea el dispositivo:

```bash
adb devices
```

5. Con Metro corriendo, redirigir el puerto:

```bash
adb reverse tcp:8081 tcp:8081
```

6. Si la app ya esta instalada, se puede volver a abrir con:

```bash
adb shell am start -n com.app/.MainActivity
```

## Escaneo de codigos

- La camara detecta codigos `EAN-13` y `EAN-8`
- Se usa una ventana corta de lecturas para hacer el escaneo mas robusto
- Se valida checksum EAN para reducir falsos positivos

## Estructura actual

El frontend vive en `stoqo_frontend/app`.

Dentro de `app/src` se esta empezando a ordenar el proyecto con una estructura tipo Atomic Design:

- `components/atoms`
- `components/molecules`
- `components/organisms`
- `screens`
- `utils`
- `types`
- `constants`
