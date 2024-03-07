/* The enter biometrics page */
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/common/components/buttons/small_round_button.dart';
import 'package:frontend/common/services/api/user_api_service.dart';
import 'package:frontend/features/auth/providers/auth_page_state_provider.dart';
import 'package:frontend/features/syncing/providers/syncing_page_state_provider.dart';
import 'package:frontend/logging/logger.dart';
import 'package:intl/intl.dart';

/* Enter biometrics page widget */
class EnterBiometricsPage extends ConsumerStatefulWidget {
  const EnterBiometricsPage({super.key});

  @override
  ConsumerState<EnterBiometricsPage> createState() =>
      _EnterBiometricsPageState();
}

class _EnterBiometricsPageState extends ConsumerState<EnterBiometricsPage> {
  // Define lists for the picker data.
  // TODO: move these somewhere to integrate with User schema (check backend too)
  final List<String> sexOptions = ['Male', 'Female'];
  final List<String> unitOptions = ['Imperial', 'Metric'];
  final List<String> activityLevelOptions = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
    'Extremely Active'
  ];
  final List<String> weightGoalOptions = [
    'Fast loss',
    'Moderate loss',
    'Slow loss',
    'Maintain',
    'Slow Gain',
    'Moderate Gain',
    'Fast Gain',
  ];

  // TODO: set all values initially to "select, then enforce that they must be selected"
  String selectedSex = 'Select';
  DateTime? selectedBirthday;
  String selectedUnit = 'Imperial';
  int selectedHeight = -1; // Default in cm for more precision over in
  int selectedWeight = -1; // Default in lbs for more precision over kg
  String selectedActivityLevel = 'Select';
  String selectedWeightGoal = 'Select';

  // TODO: remove this later, since we don't need a logout page
  void signOutUser(WidgetRef ref) async {
    FirebaseAuth.instance.signOut();
    ref.read(authPageStateProvider.notifier).state = AuthPageState.login;
  }

  // TODO create input validation to ensure all fields must be filled in before continuing
  void createUser(WidgetRef ref) async {
    try {
      /* Get uid */
      final userId = FirebaseAuth.instance.currentUser?.uid;

      /* Sign out if no user */
      if (userId == null) {
        signOutUser(ref);
        return;
      }

      // TODO: add user to realm first

      /* Make HTTP request to create new user info */
      // TODO: handle this error with HTTP on its own
      await UserApiService.createUser(
        userId: userId,
        birthday: selectedBirthday!,
        sex: sexOptions.indexOf(selectedSex),
        height: selectedHeight,
        weight: selectedWeight,
        activityLevel: activityLevelOptions.indexOf(selectedActivityLevel),
        weightGoal: weightGoalOptions.indexOf(selectedWeightGoal),
        userMetric: selectedUnit == 'Imperial' ? false : true,
      );

      // TODO: navigate to home page, change to custom macros page later
      ref.read(syncingPageStateProvider.notifier).state = SyncingPageState.home;
    } catch (error) {
      appLogger.info(
        'Error occurred while syncing new user to server. Logging out:\n',
        error,
      ); // TODO: fix handling of error
      signOutUser(ref);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Profile Setup',
          style: Theme.of(context).textTheme.displayMedium,
        ),
        backgroundColor: Theme.of(context).colorScheme.onSecondary,
      ),
      body: SafeArea(
        child: ListView(
          children: [
            buildCustomListTile(
              'Sex',
              selectedSex,
              () => showPicker(
                context,
                'Sex',
                sexOptions,
                (String newValue) {
                  setState(() {
                    selectedSex = newValue;
                  });
                },
                selectedSex,
              ),
              context,
            ),
            buildCustomListTile(
              'Birthday',
              selectedBirthday != null
                  ? DateFormat('yyyy-MM-dd').format(selectedBirthday!)
                  : 'Select',
              () => pickDate(context),
              context,
            ),
            buildCustomListTile(
              'Units',
              selectedUnit,
              () => showPicker(
                context,
                'Units',
                unitOptions,
                (String newValue) {
                  setState(() {
                    selectedUnit = newValue;
                  });
                },
                selectedUnit,
              ),
              context,
            ),
            buildCustomListTile(
              'Height',
              selectedHeight == -1
                  ? 'Select'
                  : formatHeight(
                      selectedHeight,
                      selectedUnit,
                    ), // Use the helper function for formatting
              () {
                showHeightPicker(context);
              },
              context,
            ),
            buildCustomListTile(
              'Weight',
              selectedWeight == -1
                  ? 'Select'
                  : formatWeight(
                      selectedWeight,
                      selectedUnit,
                    ),
              () {
                showWeightPicker(context);
              },
              context,
            ),
            buildCustomListTile(
              'Activity Level',
              selectedActivityLevel,
              () => showPicker(
                context,
                'Activity Level',
                activityLevelOptions,
                (String newValue) {
                  setState(() {
                    selectedActivityLevel = newValue;
                  });
                },
                selectedActivityLevel,
              ),
              context,
            ),
            buildCustomListTile(
              'Weight Goal',
              selectedWeightGoal,
              () => showPicker(
                context,
                'Weight Goal',
                weightGoalOptions,
                (String newValue) {
                  setState(() {
                    selectedWeightGoal = newValue;
                  });
                },
                selectedWeightGoal,
              ),
              context,
            ),
            SmallRoundButton(
              title: "I'm finished",
              onPressed: () {
                createUser(ref);
              }, // TODO: edit this button or use another one
            ),
            SmallRoundButton(
              title: "Logout",
              onPressed: () {
                signOutUser(ref);
              },
            ),
          ],
        ),
      ),
    );
  }

  String formatHeight(int heightCm, String unit) {
    if (unit == "Metric") {
      return "$heightCm cm";
    } else {
      // Convert cm to feet and inches
      final int totalInches = (heightCm / 2.54).round();
      final int feet = totalInches ~/ 12;
      final int inches = totalInches % 12;

      return "$feet' $inches\"";
    }
  }

  String formatWeight(int weightLbs, String unit) {
    if (unit == "Imperial") {
      return "$weightLbs lbs";
    } else {
      final int weightKg = (weightLbs / 2.2).round();

      return "$weightKg kg";
    }
  }

// TODO: move this into another file
  void showPicker(BuildContext context, String title, List<String> options,
      ValueChanged<String> onSelectedItemChanged, String initialValue) {
    int selectedIndex =
        options.indexOf(initialValue); // For 'Sex', adjust for others
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SizedBox(
          height: 250,
          child: Column(
            children: [
              Container(
                height: 50,
                color: Theme.of(context).colorScheme.onSecondary,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    CupertinoButton(
                      child: Text(
                        'Cancel',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    CupertinoButton(
                      child: Text(
                        'OK',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      onPressed: () {
                        Navigator.of(context).pop();
                        onSelectedItemChanged(options[selectedIndex]);
                      },
                    ),
                  ],
                ),
              ),
              Expanded(
                child: CupertinoPicker(
                  magnification: 1.22,
                  backgroundColor: Theme.of(context).colorScheme.background,
                  itemExtent: 32.0,
                  onSelectedItemChanged: (int index) {
                    selectedIndex =
                        index; // Update selectedIndex with the current index
                  },
                  scrollController: FixedExtentScrollController(
                    initialItem: selectedIndex,
                  ),
                  children: List<Widget>.generate(options.length, (int index) {
                    return Center(
                      child: Text(
                        options[index],
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    );
                  }), // Ensure the picker starts at the current selection
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> pickDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedBirthday ?? DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.dark(
              primary: Theme.of(context)
                  .colorScheme
                  .surface, // Header background color
              onPrimary: Theme.of(context)
                  .colorScheme
                  .onBackground, // Header backr text color
              onSurface: Theme.of(context).colorScheme.onBackground,
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: Theme.of(context).colorScheme.onBackground,
                textStyle: Theme.of(context).textTheme.bodyLarge,
              ),
            ),
            datePickerTheme: DatePickerThemeData(
              backgroundColor: Theme.of(context).colorScheme.background,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && picked != selectedBirthday) {
      setState(() {
        selectedBirthday = picked;
      });
    }
  }

  void showHeightPicker(BuildContext context) {
    // Define the range for feet and inches
    List<int> feetOptions = List.generate(9, (index) => index); // Up to 8 feet
    List<int> inchesOptions =
        List.generate(12, (index) => index); // 0-11 inches

    int selectedIndex = selectedHeight;
    // Convert selectedHeight to feet and inches if Imperial
    int feet = 0;
    int inches = 0;
    if (selectedUnit == 'Imperial') {
      double totalInches = selectedHeight / 2.54; // Convert cm to inches
      feet = totalInches ~/ 12;
      inches = (totalInches.round() % 12).round();
    }

    // TODO create helper for conversion

    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SizedBox(
          height: 250,
          child: Column(
            children: [
              Container(
                height: 50,
                color: Theme.of(context).colorScheme.onSecondary,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    CupertinoButton(
                      child: Text(
                        'Cancel',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    CupertinoButton(
                      child: Text(
                        'OK',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      onPressed: () {
                        Navigator.of(context).pop();
                        // Convert feet and inches back to cm and set selectedHeight
                        setState(() {
                          if (selectedUnit == 'Imperial') {
                            selectedHeight = (((feet * 12) + inches) * 2.54)
                                .round(); // convert to CM
                          } else {
                            selectedHeight = selectedIndex; // use CM
                          }
                        });
                      },
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (selectedUnit == 'Imperial') ...[
                      Expanded(
                        child: CupertinoPicker(
                          backgroundColor:
                              Theme.of(context).colorScheme.background,
                          itemExtent: 32.0,
                          scrollController:
                              FixedExtentScrollController(initialItem: feet),
                          onSelectedItemChanged: (int index) {
                            feet = index; // Update feet
                          },
                          children: List<Widget>.generate(feetOptions.length,
                              (int index) {
                            return Center(
                                child: Text('${feetOptions[index]} ft',
                                    style:
                                        Theme.of(context).textTheme.bodyLarge));
                          }),
                        ),
                      ),
                      Expanded(
                        child: CupertinoPicker(
                          backgroundColor:
                              Theme.of(context).colorScheme.background,
                          itemExtent: 32.0,
                          scrollController:
                              FixedExtentScrollController(initialItem: inches),
                          onSelectedItemChanged: (int index) {
                            inches = index; // Update inches
                          },
                          children: List<Widget>.generate(inchesOptions.length,
                              (int index) {
                            return Center(
                                child: Text('${inchesOptions[index]} in',
                                    style:
                                        Theme.of(context).textTheme.bodyLarge));
                          }),
                        ),
                      ),
                    ] else ...[
                      Expanded(
                        child: CupertinoPicker(
                          magnification: 1.22,
                          backgroundColor:
                              Theme.of(context).colorScheme.background,
                          itemExtent: 32.0,
                          scrollController: FixedExtentScrollController(
                            initialItem: selectedIndex,
                          ),
                          onSelectedItemChanged: (int index) {
                            selectedIndex =
                                index; // Temporarily store new index
                          },
                          children: List.generate(
                                  501, (index) => index) // Up to 500 cm
                              .map((cm) => Center(
                                  child: Text('$cm cm',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyLarge)))
                              .toList(),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void showWeightPicker(BuildContext context) {
    int maxValue =
        selectedUnit == 'Metric' ? 500 : 1100; // Max weight in kg or lbs
    List<int> weightOptions = List.generate(maxValue, (index) => index);
    int selectedIndex = selectedUnit == 'Imperial'
        ? selectedWeight
        : (selectedWeight / 2.2).round(); // convert lbs to kg for metric

    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SizedBox(
          height: 250,
          child: Column(
            children: [
              Container(
                height: 50,
                color: Theme.of(context).colorScheme.onSecondary,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    CupertinoButton(
                      child: Text(
                        'Cancel',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    CupertinoButton(
                      child: Text(
                        'OK',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                      onPressed: () {
                        Navigator.of(context).pop();
                        setState(() {
                          if (selectedUnit == 'Metric') {
                            selectedWeight = (selectedIndex * 2.2)
                                .round(); // convert kg to lbs
                          } else {
                            selectedWeight = selectedIndex; // already in lbs
                          }
                        });
                      },
                    ),
                  ],
                ),
              ),
              Expanded(
                child: CupertinoPicker(
                  magnification: 1.22,
                  backgroundColor: Theme.of(context).colorScheme.background,
                  itemExtent: 32.0,
                  scrollController:
                      FixedExtentScrollController(initialItem: selectedIndex),
                  onSelectedItemChanged: (int index) {
                    selectedIndex = index; // Temporarily store new index
                  },
                  children:
                      List<Widget>.generate(weightOptions.length, (int index) {
                    return Center(
                      child: Text(
                        '${weightOptions[index]} ${selectedUnit == 'Metric' ? 'kg' : 'lbs'}',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    );
                  }),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// TODO: find make sure max values for weight and height conform to backend constraints

// TODO: move to own component class
Widget buildCustomListTile(
  String label,
  String value,
  VoidCallback onTap,
  BuildContext context,
) {
  return Column(
    children: [
      InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16.0),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                  color: Theme.of(context).colorScheme.surface, width: .25),
            ), // Faint thin border
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineLarge,
              ),
            ],
          ),
        ),
      ),
    ],
  );
}
