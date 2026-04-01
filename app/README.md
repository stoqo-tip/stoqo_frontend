# App

Aplicacion mobile Android de Stoqo construida con React Native CLI y TypeScript.

## Comandos principales

```bash
npm install
npm start
npm run android
```

## Requisitos

- Node.js 22+
- Android Studio con SDK instalado
- `adb` disponible en `PATH`

## Escaneo

La app usa:

- `react-native-vision-camera`
- Google ML Kit Barcode Scanning en Android

Actualmente el escaner reconoce:

- `EAN-13`
- `EAN-8`

La documentacion general del frontend esta en `../README.md`.
