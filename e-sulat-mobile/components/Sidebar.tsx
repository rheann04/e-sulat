import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigation = useNavigation();

  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName as never);
    onClose();
  };

  const handleExit = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' as never }],
    });
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
        <View style={styles.sidebar}>
          <View style={styles.content}>
            <Text style={styles.header}>MENU</Text>
            
            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('Main')}
              >
                <Text style={styles.menuText}>Notes (Main Page)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('Reminder')}
              >
                <Text style={styles.menuText}>Reminder</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('Settings')}
              >
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('Archive')}
              >
                <Text style={styles.menuText}>Archive</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('Trash')}
              >
                <Text style={styles.menuText}>Trash</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
              <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayTouch: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sidebar: {
    width: '75%',
    backgroundColor: '#FEF3C7', // Warm yellow background
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#92400E', // Deep amber for contrast
    marginBottom: 32,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B', // Golden accent line
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  menuItems: {
    flex: 1,
    gap: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 3,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.3)', // Subtle yellow tint
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#78350F', // Rich brown for readability
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  exitButton: {
    backgroundColor: '#DC2626', // Modern red
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exitButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});