/* Class for interacting with user collection in realm */

import 'package:frontend/common/models/user.dart';
import 'package:realm/realm.dart' hide User;

/* Class for interacting with realm local DB */
class UserRealmService {
  /* Creates a user in the realm DB given user data from an HTTP response */
  static Future<void> createUser(Map<String, dynamic> userData) async {
    try {
      /* Open realm and get current config */
      final config = Configuration.local([User.schema, Goals.schema]);
      final realm = Realm(config);

      /* Delete any existing realm user and goals objects */
      final existingUsers = realm.all<User>();
      final existingGoals = realm.all<Goals>();
      realm.write(() {
        realm.deleteMany(existingUsers);
        realm.deleteMany(existingGoals);
      });

      /* Create goals object */
      final Goals goals = Goals(
        userData['goals']['calories'],
        userData['goals']['protein'],
        userData['goals']['fat'],
        userData['goals']['carbohydrates'],
      );

      /* Create user object */
      final User user = User(
        userData['_id'],
        DateTime.parse(userData['birthday']),
        userData['sex'],
        userData['height'],
        userData['weight'],
        userData['activityLevel'],
        userData['weightGoal'],
        userData['useMetric'],
        DateTime.parse(userData['createdAt']),
        DateTime.parse(userData['updatedAt']),
        goals: goals,
      );
      /* Write user to local */
      realm.write(() {
        realm.add(user);
      });

      /* close realm */
      realm.close();
    } catch (error) {
      rethrow;
    }
  }
}
