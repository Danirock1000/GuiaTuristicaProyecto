import { View, Text, StyleSheet } from 'react-native';


interface CustomEvent {
  title: string;
  location?: string;
  date?: string;
  name?: string;
  email?: string;
  age?: string;
  variant?: 'default' | 'done';
}

export default function CustomEvent({
  title,
  location,
  date,
  name,
  email,
  age,
  variant = 'default',
}: CustomEvent) {

  const cardStyle =
    variant === 'done' ? styles.cardDone : styles.cardDefault;

  const titleStyle =
    variant === 'done' ? styles.titleDone : styles.titleDefault;

  const content = (
    <View style={[styles.card, cardStyle]}>
      <View style={styles.leftContent}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.subtitle]}>{location}</Text>
        <Text style={[styles.subtitle]}>{email}</Text>
        <Text style={[styles.subtitle]}>{age}</Text>
        <Text style={[styles.subtitle]}>{date}</Text>
      </View>
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 32,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDefault: {
    backgroundColor: '#00A389',
    borderColor: '#E0E0E0',
  },
  cardDone: {
    backgroundColor: '#81C784',
    borderColor: 'green',
  },
  leftContent: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleDefault: {
    color: '#FFFFFF',
  },
  titleDone: {
    color: '#2E7D32',
    textDecorationLine: 'line-through',
  },
  subtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 4,
  },
  rightText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#607D8B',
  },
});
