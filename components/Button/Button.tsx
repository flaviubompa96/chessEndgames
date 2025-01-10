import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  label: string;
  handlePress: () => void;
}

export const Button = ({ label, handlePress }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={handlePress} style={styles.root}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    paddingVertical: 16,
    margin: 25,
    backgroundColor: 'green',
    borderRadius: 5,
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
