import 'package:logging/logging.dart';

final Logger appLogger = Logger('AppLogger');

void initializeLogger() {
  Logger.root.level = Level.ALL;
  Logger.root.onRecord.listen((record) {
    // ignore: avoid_print
    print('${record.level.name}: ${record.time}: ${record.message}');
  });
}
