import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface EventData {
  type: string;
  attendees: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  coverImage: string | null;
}

const ScheduleEvent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState<EventData>({
    type: '',
    attendees: 2,
    date: '',
    startTime: '18:00',
    endTime: '22:00',
    location: '',
    coverImage: null,
  });

  const eventTypes = [
    'Pool Party',
    'Birthday',
    'Fundraiser',
    'Happy Hour',
    'Game night',
    'Cooking',
    'Cycling tour',
  ];

  const attendeeOptions = [2, 8];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert('Success', 'Event created successfully!');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEventTypeSelect = (type: string) => {
    setEventData({ ...eventData, type });
  };

  const handleAttendeeSelect = (count: number) => {
    setEventData({ ...eventData, attendees: count });
  };

  const handleDateSelect = (date: string) => {
    setEventData({ ...eventData, date });
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate();
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = eventData.date === dateString;
      
      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => handleDateSelect(dateString)}
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
          ]}
        >
          <Text
            style={[
              styles.calendarDayText,
              isSelected && styles.selectedDayText,
              isToday && !isSelected && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
        </View>
        <View style={styles.calendarWeekHeader}>
          {dayNames.map((dayName, index) => (
            <View key={index} style={styles.calendarWeekDay}>
              <Text style={styles.calendarWeekDayText}>{dayName}</Text>
            </View>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {days}
        </View>
      </View>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What event are you hosting? 🍾</Text>
            <Text style={styles.stepSubtitle}>
              You can change the event type later
            </Text>
            <View style={styles.optionsList}>
              {eventTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleEventTypeSelect(type)}
                  style={[
                    styles.optionButton,
                    eventData.type === type && styles.selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      eventData.type === type && styles.selectedOptionText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Room for a few or the whole city?</Text>
            <View style={styles.attendeeOptions}>
              {attendeeOptions.map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => handleAttendeeSelect(count)}
                  style={[
                    styles.attendeeButton,
                    eventData.attendees === count && styles.selectedAttendee,
                  ]}
                >
                  <Text style={styles.attendeeNumber}>{count}</Text>
                  <View style={styles.usersIcon}>
                    <Text style={styles.iconText}>👥</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <ScrollView style={styles.stepContainer}>
            <Text style={styles.stepTitle}>When? ❤️</Text>
            {renderCalendar()}
            <View style={styles.timeContainer}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Start</Text>
                <TextInput
                  style={styles.timeField}
                  value={eventData.startTime}
                  onChangeText={(time) => setEventData({ ...eventData, startTime: time })}
                  placeholder="18:00"
                />
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>End</Text>
                <TextInput
                  style={styles.timeField}
                  value={eventData.endTime}
                  onChangeText={(time) => setEventData({ ...eventData, endTime: time })}
                  placeholder="22:00"
                />
              </View>
            </View>
          </ScrollView>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Where would you like to meet?</Text>
            <View style={styles.mapContainer}>
              <View style={styles.mockMap}>
                <View style={styles.mapMarker}>
                  <View style={styles.markerDot} />
                </View>
                {/* Mock location markers */}
                <View style={[styles.smallMarker, { top: '25%', left: '25%' }]} />
                <View style={[styles.smallMarker, { top: '75%', right: '25%' }]} />
                <View style={[styles.smallMarker, { bottom: '25%', left: '30%' }]} />
              </View>
              <View style={styles.locationInfo}>
                <View style={styles.locationCard}>
                  {/* <MapPin size={20} color="#EF4444" /> */}
                  <Text style={styles.locationText}>Vente: Auditorium</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Add a cover image for your event</Text>
            <TouchableOpacity style={styles.imageUpload}>
              <View style={styles.imageIcon}>
                <Text style={styles.imageIconText}>🖼️</Text>
              </View>
              <Text style={styles.uploadText}>Drag and drop an image here, or</Text>
              <Text style={styles.browseText}>Browse files</Text>
            </TouchableOpacity>
            <Text style={styles.uploadHint}>
              Recommended size: 800 x 400 pixels
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !eventData.type;
      case 3:
        return !eventData.date;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          disabled={currentStep === 1}
        >
          <Text style={[styles.backIcon, currentStep === 1 && styles.disabledIcon]}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={styles.stepCounter}>{currentStep}/5</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / 5) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderStep()}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={isNextDisabled()}
          style={[
            styles.nextButton,
            isNextDisabled() && styles.disabledButton,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 5 ? 'Finish' : 'Proceed'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#374151',
    fontWeight: 'bold',
  },
  disabledIcon: {
    color: '#D1D5DB',
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EF4444',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 32,
    color: '#111827',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  optionsList: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#EF4444',
  },
  attendeeOptions: {
    gap: 16,
  },
  attendeeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedAttendee: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  attendeeNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  usersIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EF4444',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 32,
    color: '#111827',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  optionsList: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#EF4444',
  },
  attendeeOptions: {
    gap: 16,
  },
  attendeeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedAttendee: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  attendeeNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginBottom: 24,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  calendarWeekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarWeekDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: width / 7 - 8,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedDay: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
  },
  todayDay: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  todayDayText: {
    color: '#EF4444',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  timeField: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
  },
  mockMap: {
    height: 300,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
  },
  mapMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 24,
    height: 24,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  markerDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  smallMarker: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#6B7280',
    borderRadius: 6,
  },
  locationInfo: {
    paddingHorizontal: 24,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    gap: 8,
  },
  mapPinIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 48,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imageIconText: {
    fontSize: 48,
  },
  uploadText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 16,
  },
  browseText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
  uploadHint: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ScheduleEvent;