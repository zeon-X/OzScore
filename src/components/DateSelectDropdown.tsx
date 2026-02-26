import { Colors } from "@/constants/theme";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ActiveSelect = "year" | "month" | "day" | null;

type DateSelectDropdownProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DateSelectDropdown({
  selectedDate,
  onDateChange,
}: DateSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSelect, setActiveSelect] = useState<ActiveSelect>(null);
  const [tempYear, setTempYear] = useState(selectedDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(selectedDate.getMonth());
  const [tempDay, setTempDay] = useState(selectedDate.getDate());

  const yearRange = useMemo(() => {
    const startYear = 2025;
    const endYear = new Date().getFullYear() + 10;
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index,
    );
  }, []);

  const dayRange = useMemo(() => {
    const daysInMonth = new Date(tempYear, tempMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [tempYear, tempMonth]);

  const openDatePicker = () => {
    setTempYear(selectedDate.getFullYear());
    setTempMonth(selectedDate.getMonth());
    setTempDay(selectedDate.getDate());
    setActiveSelect(null);
    setIsOpen((prev) => !prev);
  };

  const closeDatePicker = () => {
    setIsOpen(false);
    setActiveSelect(null);
  };

  const applyDatePicker = () => {
    const daysInMonth = new Date(tempYear, tempMonth + 1, 0).getDate();
    const nextDay = Math.min(tempDay, daysInMonth);
    onDateChange(new Date(tempYear, tempMonth, nextDay));
    closeDatePicker();
  };

  const toggleActiveSelect = (select: Exclude<ActiveSelect, null>) => {
    setActiveSelect((prev) => (prev === select ? null : select));
  };

  const selectYear = (year: number) => {
    const maxDay = new Date(year, tempMonth + 1, 0).getDate();
    setTempYear(year);
    setTempDay((prev) => Math.min(prev, maxDay));
    setActiveSelect(null);
  };

  const selectMonth = (month: number) => {
    const maxDay = new Date(tempYear, month + 1, 0).getDate();
    setTempMonth(month);
    setTempDay((prev) => Math.min(prev, maxDay));
    setActiveSelect(null);
  };

  const selectDay = (day: number) => {
    setTempDay(day);
    setActiveSelect(null);
  };

  return (
    <>
      <TouchableOpacity style={styles.monthYear} onPress={openDatePicker}>
        <Text style={styles.monthYearText}>
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()} ▼
        </Text>
      </TouchableOpacity>

      {isOpen ? (
        <View style={styles.dropdownCard}>
          <View style={styles.selectRow}>
            <View style={styles.selectField}>
              <Text style={styles.dropdownLabel}>Year</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => toggleActiveSelect("year")}
              >
                <Text style={styles.selectText}>{tempYear}</Text>
                <Text style={styles.selectChevron}>▼</Text>
              </TouchableOpacity>
              {activeSelect === "year" ? (
                <View style={styles.optionsPanelInline}>
                  <ScrollView
                    style={styles.optionsList}
                    showsVerticalScrollIndicator={false}
                  >
                    {yearRange.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={styles.optionRow}
                        onPress={() => selectYear(year)}
                      >
                        <Text
                          style={[
                            styles.optionRowText,
                            tempYear === year && styles.optionRowTextActive,
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </View>

            <View style={styles.selectField}>
              <Text style={styles.dropdownLabel}>Month</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => toggleActiveSelect("month")}
              >
                <Text style={styles.selectText}>{monthNames[tempMonth]}</Text>
                <Text style={styles.selectChevron}>▼</Text>
              </TouchableOpacity>
              {activeSelect === "month" ? (
                <View style={styles.optionsPanelInline}>
                  <ScrollView
                    style={styles.optionsList}
                    showsVerticalScrollIndicator={false}
                  >
                    {monthNames.map((month, index) => (
                      <TouchableOpacity
                        key={month}
                        style={styles.optionRow}
                        onPress={() => selectMonth(index)}
                      >
                        <Text
                          style={[
                            styles.optionRowText,
                            tempMonth === index && styles.optionRowTextActive,
                          ]}
                        >
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </View>

            <View style={styles.selectField}>
              <Text style={styles.dropdownLabel}>Day</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => toggleActiveSelect("day")}
              >
                <Text style={styles.selectText}>{tempDay}</Text>
                <Text style={styles.selectChevron}>▼</Text>
              </TouchableOpacity>
              {activeSelect === "day" ? (
                <View style={styles.optionsPanelInline}>
                  <ScrollView
                    style={styles.optionsList}
                    showsVerticalScrollIndicator={false}
                  >
                    {dayRange.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={styles.optionRow}
                        onPress={() => selectDay(day)}
                      >
                        <Text
                          style={[
                            styles.optionRowText,
                            tempDay === day && styles.optionRowTextActive,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.dropdownActions}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={closeDatePicker}
            >
              <Text style={styles.dropdownButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dropdownButton, styles.dropdownButtonPrimary]}
              onPress={applyDatePicker}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  styles.dropdownButtonTextPrimary,
                ]}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  monthYear: {
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  dropdownCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  selectRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectField: {
    flex: 1,
    gap: 6,
    position: "relative",
  },
  selectInput: {
    minHeight: 40,
    paddingHorizontal: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: Colors.text,
    fontWeight: "500",
  },
  selectChevron: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  optionsPanelInline: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    zIndex: 30,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  optionsList: {
    maxHeight: 160,
  },
  optionRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionRowText: {
    color: Colors.text,
    fontWeight: "500",
  },
  optionRowTextActive: {
    color: Colors.tint,
    fontWeight: "700",
  },
  dropdownActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  dropdownButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownButtonPrimary: {
    backgroundColor: Colors.button,
    borderColor: Colors.button,
  },
  dropdownButtonText: {
    color: Colors.text,
    fontWeight: "600",
  },
  dropdownButtonTextPrimary: {
    color: Colors.buttonText,
  },
});
