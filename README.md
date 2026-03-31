# Stoqo Frontend

Frontend de la aplicación Stoqo, desarrollado con React Native y Expo.

## Requisitos

- Node.js 18+
- [Expo Go](https://expo.dev/go) instalado en el celular (para pruebas en dispositivo físico)
- [Android Studio](https://developer.android.com/studio) (para el emulador)

## Instalar dependencias

```bash
cd app
npm install
```

## Correr el servidor de desarrollo

```bash
npx expo start
```

## Ver la app en el celular

Hay que estar en la misma red que la PC. Si la PC está en LAN y el celular en WiFi, puede funcionar igual si el router los pone en la misma subred. En caso de que no funcione, se puede usar tunnel:

```bash
npx expo start --tunnel
```

Si pide instalar la dependencia:

```bash
npx expo install @expo/ngrok
```

Después hay que escanear el QR que aparece en la terminal con la app Expo Go.

## Ver la app en el emulador Android

1. Instalar Android Studio:

```bash
yay -S android-studio
```

2. Abrir Android Studio, ir a **More Actions > Virtual Device Manager** y crear un dispositivo

3. Iniciar el emulador y presionar `a` en la terminal donde corre `npx expo start`
