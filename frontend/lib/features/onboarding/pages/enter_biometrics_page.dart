/* The enter biometrics page */
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/common/components/buttons/small_round_button.dart';
import 'package:frontend/features/auth/providers/auth_page_state_provider.dart';
import 'package:intl/intl.dart';

/* Enter biometrics page widget */
class EnterBiometricsPage extends ConsumerStatefulWidget {
  const EnterBiometricsPage({super.key});

  @override
  ConsumerState<EnterBiometricsPage> createState() =>
      _EnterBiometricsPageState();
}

class _EnterBiometricsPageState extends ConsumerState<EnterBiometricsPage> {
  // TODO: set all values initially to "select, then enforce that they must be selected"
  String selectedSex = 'Male';
  DateTime? selectedBirthday;
  String selectedUnit = 'Metric';
  int selectedHeight = 0; // Default in cm for metric
  int selectedWeight = 0; // Default in kg for metric
  String selectedActivityLevel = 'Sedentary';
  String selectedWeightGoal = 'Maintain';

  // Define lists for the picker data
  final List<String> sexOptions = ['Male', 'Female', 'Other'];
  final List<String> unitOptions = ['Metric', 'Imperial'];
  final List<String> activityLevelOptions = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
    'Extremely Active'
  ];
  final List<String> weightGoalOptions = ['Lose', 'Gain', 'Maintain'];

  void signOutUser(WidgetRef ref) async {
    FirebaseAuth.instance.signOut();
    ref.read(authPageStateProvider.notifier).state = AuthPageState.login;

    // TODO: notify user if not all data has been synced with server yet

    // TODO: move this to a central shared file
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
              formatHeight(selectedHeight,
                  selectedUnit), // Use the helper function for formatting
              () {
                showHeightPicker(context);
              },
              context,
            ),
            buildCustomListTile(
              'Weight',
              '$selectedWeight ${selectedUnit == "Metric" ? "kg" : "lbs"}',
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
              title: "Logout",
              onPressed: () {
                signOutUser(ref);
              },
            )
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

    // Convert selectedHeight to feet and inches if Imperial
    int feet = 0;
    int inches = 0;
    if (selectedUnit == 'Imperial') {
      double totalInches = selectedHeight / 2.54; // Convert cm to inches
      feet = totalInches ~/ 12;
      inches = (totalInches % 12).round();
    }

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
                        if (selectedUnit == 'Imperial') {
                          selectedHeight =
                              (((feet * 12) + inches) * 2.54).round();
                        }
                        setState(() {});
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
                          onSelectedItemChanged: (int index) {
                            // Assuming you have a method to convert cm to the selectedHeight
                            selectedHeight = index + 1; // cm starts at 1
                          },
                          children: List.generate(
                                  500, (index) => index + 1) // Up to 500 cm
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
    List<int> weightOptions = List.generate(maxValue, (index) => index + 1);
    int selectedIndex = selectedWeight - 1; // Adjust based on zero indexing

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
                          selectedWeight = weightOptions[selectedIndex];
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
