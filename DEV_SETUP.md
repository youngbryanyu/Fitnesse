# Setting up the Development Environment

Tips for setting up the development environment, specifically for Flutter/Dart

(For more detailed documentation on Flutter installations, CocoaPods for macOS Flutter Package integration, or setup troubleshooting, please reference this link for more information: [Flutter Docs](https://docs.flutter.dev/get-started/install))

If running on Windows, we recommend that you use VSCode on Windows for frontend development because it has the highest compatibility with Flutter and Android Studio. For backend development on Windows, developers may work with their preference of Powershell/VSCode on Windows or with a remote connection to WSL.

## Prerequisites:

- Recommended 4-8 CPU cores, 8-16 GB RAM, 1920x1080 display resolution or higher, 10+GB free storage for Windows/Android development and 56+GB free storage for MacOS/iOS development.
- Ensure native git (Windows/Mac) 2.4 or later is installed to maintain source code and Android Studio 2022.3 (Giraffe) or Xcode 15 is installed depending on platform. 

Note: Downloading Flutter may download resources from Google servers, and so by downloading or using the Flutter SDK you agree to the Google Terms of Service. `flutter` uses Google Analytics to report statistics and crash reports and can be disabled using `flutter config --no-analytics`, and the current status can be checked with `flutter config`. Dart tools may also cause usage metric reports, and can be disabled with `dart --disable-analytics` and re-enabled with `dart enable-analytics`

## IDE Setup
We highly recommend using VSCode for frontend development for the highest compatibility and ease of setup

If using VSCode 1.75 or later, it's recommended that you install the [VSCode Flutter Plugin](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter). 

## SDK Installation

### Windows 

### Linux (WSL recommended because of incompatibility between WSL and Android studio)
1. Use `snapd` to install flutter with `sudo snap install flutter --classic`
2. Run `flutter sdk-path` to display the flutter SDK installation path
3. Run `flutter doctor` to verify the status of the Flutter and Dart installations
4. Run `which flutter`. If this command errors, find the binary for `flutter` by running this command (or similar commands involving `rg` or `fd`): `find / -type d -wholename "flutter/bin" 2>/dev/null` and take the output and run the command `$ echo 'export PATH="$PATH:<path_to_flutter_directory>/flutter/bin"' >> $HOME/.bashrc && source ~/.bashrc && which flutter dart`. This compound command will find the flutter/bin binary directory, add it to the user's .bashrc file, re-source it, and then run the `which` command to output the proper flutter and dart binary paths, which should come from the same `bin` directory. For instance,
```bash
$ which flutter dart
/path-to-flutter-sdk/bin/flutter
/usr/local/bin/dart
``` 
This would be incorrectly set up because the flutter and dart binaries aren't located in the same directory. The proper output should be:
```bash
$ which flutter dart
/path-to-flutter-sdk/bin/flutter
/path-to-flutter-sdk/bin/dart
```
If this output is incorrect, please update the path to use the commands from `/path-to-flutter-sdk` before commands from `/usr/local/bin` (in this case).

### MacOS (iOS setup)