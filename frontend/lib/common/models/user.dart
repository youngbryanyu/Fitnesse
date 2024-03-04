/* Data model for a user */

/* Sex enum matching backend */
import 'package:realm/realm.dart';

part 'user.g.dart';

enum Sex { male, female }

/* Activity level enum matching backend */
enum ActivityLevel {
  sedentary,
  lightlyActive,
  moderatelyActive,
  veryActive,
  extremelyActive
}

/* Weight goal enum matching backend */
enum WeightGoal {
  fastLoss,
  moderateLoss,
  slowLoss,
  maintain,
  slowGain,
  moderateGain,
  fastGain
}

/* Convert enums to int for storage */
int _enumToInt(dynamic enumValue) => enumValue.index;

/* Data model for a user */
@RealmModel()
class _User {
  @PrimaryKey()
  late String id;
  late DateTime birthday;
  @MapTo('sex')
  late int sexIndex;
  late int height;
  late int weight;
  @MapTo('activityLevel')
  late int activityLevelIndex;
  @MapTo('weightGoal')
  late int weightGoalIndex;
  late bool useMetric;
  late _Goals? goals;
  late DateTime createdAt;
  late DateTime updatedAt;

  /* Create getters and setters for enum fields */
  Sex get sex => Sex.values[sexIndex];
  set sex(Sex value) => sexIndex = _enumToInt(value);

  ActivityLevel get activityLevel => ActivityLevel.values[activityLevelIndex];
  set activityLevel(ActivityLevel value) =>
      activityLevelIndex = _enumToInt(value);

  WeightGoal get weightGoal => WeightGoal.values[weightGoalIndex];
  set weightGoal(WeightGoal value) => weightGoalIndex = _enumToInt(value);
}

/* Data model for macro goals */
@RealmModel()
class _Goals {
  late int calories;
  late int protein;
  late int fat;
  late int carbohydrates;
}
