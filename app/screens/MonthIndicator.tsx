import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const MonthIndicator = ({ scrollY }) => {
  const [currentMonth, setCurrentMonth] = useState('');
  const opacity = new Animated.Value(0);

  // Calculate which month to show based on scroll position
  const updateMonth = (y) => {
    // Assuming each formation card is roughly 300px tall
    const monthIndex = Math.floor(y / 300);
    const date = new Date();
    date.setMonth(date.getMonth() + monthIndex);
    
    const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date);
    setCurrentMonth(monthName.charAt(0).toUpperCase() + monthName.slice(1));
    
    // Show indicator when scrolling
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      updateMonth(value);
    });
    return () => scrollY.removeListener(listener);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.pill}>
        <Text style={styles.monthText}>{currentMonth}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    zIndex: 1000,
  },
  pill: {
    backgroundColor: 'rgba(25, 25, 25, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  monthText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MonthIndicator;