import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [data, setData] = useState([
    { type: 'header', key: 'your', id: '0', hours: 0, minutes: 0, seconds: 0 }, // Added initial time properties
    { type: 'habit', key: 'Workout', id: '1', completed: false },
    { type: 'habit', key: 'Read for 30 minutes', id: '2', completed: false },
    { type: 'habit', key: 'Guitar practice', id: '3', completed: false },
    { type: 'create', id: '4' },
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor(((diff % (1000 * 60 * 60)) % (1000 * 60)) / 1000);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);

      setData(prevData => prevData.map(item =>
        item.type === 'header' ? { ...item, hours, minutes, seconds } : item // Update header with time
      ));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleCompletion = (id) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id && item.type === 'habit'
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.headerTextContainer}>
          <Text style={[styles.text, {marginTop: -10}]}>Your</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Habits </Text>
            <Text style={{ fontWeight: 'normal' }}>(2)</Text>
            <View style={styles.totalStreakBubble}>
              <Text style={styles.totalStreakText}>15</Text>
            </View>
          </Text>
          <Text style={styles.bedtimeText}>{item.hours}h {item.minutes}m {item.seconds}s</Text>
        </View>
      );
    } else if (item.type === 'habit') {
      return (
        <TouchableOpacity onPress={() => toggleCompletion(item.id)} activeOpacity={0.8}>
          <LinearGradient
            colors={item.completed ? ['#98FB98', '#90EE90'] : ['#DDA0DD', '#E6E6FA']}
            style={styles.cardContainer}
          >
            <View style={styles.habitTextContainer}>
              <Text style={styles.cardText}>{item.key}</Text>
            </View>
            <View style={styles.streakTextContainer}>
              <Text style={[styles.cardText, { fontSize: 40 }]}>23</Text>
              <Text style={[styles.cardText, { fontSize: 20 }]}>day streak</Text>
            </View>
            <View style={styles.editButtonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => alert('Edit ' + item.key)}>
                <Icon name="create-outline" size={25} color="black" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    } else if (item.type === 'create') {
      return (
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={() => alert('Create new habit')}>
            <Icon name="add-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.container}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            decelerationRate={0.97}
            scrollEventThrottle={16}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    
  },
  text: {
    color: 'black',
    fontSize: 45,
    fontWeight: 'bold',
  },
  bedtimeText: {
    paddingTop: 0,
    color: 'black',
    fontSize: 25,
  },
  cardContainer: {
    height: 250,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    color: '#333',
    fontSize: 50,
    fontWeight: 'bold',
    paddingTop: 0,
    paddingLeft: 15,
  },
  separator: {
    height: 5,
  },
  headerContainer: {
    
  },
  headerTextContainer: {
  },
  totalStreakBubble: {
    backgroundColor: 'grey',
    borderRadius: 45,
  },
  totalStreakText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
  habitTextContainer: {
    paddingTop: 20,
  },
  streakTextContainer: {
    position: 'absolute',
    paddingTop: 140,
  },
  editButtonContainer: {
    position: 'absolute',
    right: 15, // Adjusted for responsive width
    top: 15,
  },
  editButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  createButtonContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 30,
    marginTop: -50,
  },
  createButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'snow',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});