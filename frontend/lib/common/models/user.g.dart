// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// RealmObjectGenerator
// **************************************************************************

// ignore_for_file: type=lint
class User extends _User with RealmEntity, RealmObjectBase, RealmObject {
  User(
    DateTime birthday,
    int sexIndex,
    int height,
    int weight,
    int activityLevelIndex,
    int weightGoalIndex,
    bool useMetric,
    DateTime createdAt,
    DateTime updatedAt, {
    Goals? goals,
  }) {
    RealmObjectBase.set(this, 'birthday', birthday);
    RealmObjectBase.set(this, 'sex', sexIndex);
    RealmObjectBase.set(this, 'height', height);
    RealmObjectBase.set(this, 'weight', weight);
    RealmObjectBase.set(this, 'activityLevel', activityLevelIndex);
    RealmObjectBase.set(this, 'weightGoal', weightGoalIndex);
    RealmObjectBase.set(this, 'useMetric', useMetric);
    RealmObjectBase.set(this, 'goals', goals);
    RealmObjectBase.set(this, 'createdAt', createdAt);
    RealmObjectBase.set(this, 'updatedAt', updatedAt);
  }

  User._();

  @override
  DateTime get birthday =>
      RealmObjectBase.get<DateTime>(this, 'birthday') as DateTime;
  @override
  set birthday(DateTime value) => RealmObjectBase.set(this, 'birthday', value);

  @override
  int get sexIndex => RealmObjectBase.get<int>(this, 'sex') as int;
  @override
  set sexIndex(int value) => RealmObjectBase.set(this, 'sex', value);

  @override
  int get height => RealmObjectBase.get<int>(this, 'height') as int;
  @override
  set height(int value) => RealmObjectBase.set(this, 'height', value);

  @override
  int get weight => RealmObjectBase.get<int>(this, 'weight') as int;
  @override
  set weight(int value) => RealmObjectBase.set(this, 'weight', value);

  @override
  int get activityLevelIndex =>
      RealmObjectBase.get<int>(this, 'activityLevel') as int;
  @override
  set activityLevelIndex(int value) =>
      RealmObjectBase.set(this, 'activityLevel', value);

  @override
  int get weightGoalIndex =>
      RealmObjectBase.get<int>(this, 'weightGoal') as int;
  @override
  set weightGoalIndex(int value) =>
      RealmObjectBase.set(this, 'weightGoal', value);

  @override
  bool get useMetric => RealmObjectBase.get<bool>(this, 'useMetric') as bool;
  @override
  set useMetric(bool value) => RealmObjectBase.set(this, 'useMetric', value);

  @override
  Goals? get goals => RealmObjectBase.get<Goals>(this, 'goals') as Goals?;
  @override
  set goals(covariant Goals? value) =>
      RealmObjectBase.set(this, 'goals', value);

  @override
  DateTime get createdAt =>
      RealmObjectBase.get<DateTime>(this, 'createdAt') as DateTime;
  @override
  set createdAt(DateTime value) =>
      RealmObjectBase.set(this, 'createdAt', value);

  @override
  DateTime get updatedAt =>
      RealmObjectBase.get<DateTime>(this, 'updatedAt') as DateTime;
  @override
  set updatedAt(DateTime value) =>
      RealmObjectBase.set(this, 'updatedAt', value);

  @override
  Stream<RealmObjectChanges<User>> get changes =>
      RealmObjectBase.getChanges<User>(this);

  @override
  User freeze() => RealmObjectBase.freezeObject<User>(this);

  static SchemaObject get schema => _schema ??= _initSchema();
  static SchemaObject? _schema;
  static SchemaObject _initSchema() {
    RealmObjectBase.registerFactory(User._);
    return const SchemaObject(ObjectType.realmObject, User, 'User', [
      SchemaProperty('birthday', RealmPropertyType.timestamp),
      SchemaProperty('sexIndex', RealmPropertyType.int, mapTo: 'sex'),
      SchemaProperty('height', RealmPropertyType.int),
      SchemaProperty('weight', RealmPropertyType.int),
      SchemaProperty('activityLevelIndex', RealmPropertyType.int,
          mapTo: 'activityLevel'),
      SchemaProperty('weightGoalIndex', RealmPropertyType.int,
          mapTo: 'weightGoal'),
      SchemaProperty('useMetric', RealmPropertyType.bool),
      SchemaProperty('goals', RealmPropertyType.object,
          optional: true, linkTarget: 'Goals'),
      SchemaProperty('createdAt', RealmPropertyType.timestamp),
      SchemaProperty('updatedAt', RealmPropertyType.timestamp),
    ]);
  }
}

class Goals extends _Goals with RealmEntity, RealmObjectBase, RealmObject {
  Goals(
    int calories,
    int protein,
    int fat,
    int carbohydrates,
  ) {
    RealmObjectBase.set(this, 'calories', calories);
    RealmObjectBase.set(this, 'protein', protein);
    RealmObjectBase.set(this, 'fat', fat);
    RealmObjectBase.set(this, 'carbohydrates', carbohydrates);
  }

  Goals._();

  @override
  int get calories => RealmObjectBase.get<int>(this, 'calories') as int;
  @override
  set calories(int value) => RealmObjectBase.set(this, 'calories', value);

  @override
  int get protein => RealmObjectBase.get<int>(this, 'protein') as int;
  @override
  set protein(int value) => RealmObjectBase.set(this, 'protein', value);

  @override
  int get fat => RealmObjectBase.get<int>(this, 'fat') as int;
  @override
  set fat(int value) => RealmObjectBase.set(this, 'fat', value);

  @override
  int get carbohydrates =>
      RealmObjectBase.get<int>(this, 'carbohydrates') as int;
  @override
  set carbohydrates(int value) =>
      RealmObjectBase.set(this, 'carbohydrates', value);

  @override
  Stream<RealmObjectChanges<Goals>> get changes =>
      RealmObjectBase.getChanges<Goals>(this);

  @override
  Goals freeze() => RealmObjectBase.freezeObject<Goals>(this);

  static SchemaObject get schema => _schema ??= _initSchema();
  static SchemaObject? _schema;
  static SchemaObject _initSchema() {
    RealmObjectBase.registerFactory(Goals._);
    return const SchemaObject(ObjectType.realmObject, Goals, 'Goals', [
      SchemaProperty('calories', RealmPropertyType.int),
      SchemaProperty('protein', RealmPropertyType.int),
      SchemaProperty('fat', RealmPropertyType.int),
      SchemaProperty('carbohydrates', RealmPropertyType.int),
    ]);
  }
}
