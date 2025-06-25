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
    { type: 'header', key: 'your', id: '0' },
    { type: 'header', key: 'habits', count: 4, id: '1' },
    { type: 'time', hours: 0, minutes: 0, seconds: 0, id: '2' },
    { type: 'habit', key: 'Workout', id: '3', completed: false },
    { type: 'habit', key: 'Read for 30 minutes', id: '4', completed: false },
    { type: 'habit', key: 'Guitar practice', id: '5', completed: false },
    { type: 'create', id: '6' },
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
        item.type === 'time' ? { ...item, hours, minutes, seconds } : item
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
    if (item.type === 'header' && item.key === 'your') {
      return <Text style={styles.text}>Your</Text>;
    } else if (item.type === 'header' && item.key === 'habits') {
      return (
        <View style={styles.headerContainer}>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Habits </Text>
            <Text style={{ fontWeight: 'normal' }}>({item.count - 2})</Text>
          </Text>
          <View style={styles.streakBubble}>
            <Text style={styles.streakText}>15</Text>
          </View>
        </View>
      );
    } else if (item.type === 'time') {
      return <Text style={styles.bedtimeText}>{item.hours}h {item.minutes}m {item.seconds}s</Text>;
    } else if (item.type === 'habit') {
      return (
        <TouchableOpacity onPress={() => toggleCompletion(item.id)} activeOpacity={0.8}>
          <LinearGradient
            colors={item.completed ? ['#98FB98', '#90EE90'] : ['#DDA0DD', '#E6E6FA']} // Green for completed, plum for incomplete
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  contentContainer: {
    paddingLeft: 20,
    paddingBottom: 0,
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
    width: 380,
    height: 240,
    borderRadius: 50,
    marginLeft: -15,
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
    position: 'relative',
  },
  streakBubble: {
    position: 'absolute',
    right: 30,
    bottom: 0,
    backgroundColor: 'grey',
    borderRadius: 45,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
  habitTextContainer: {
    paddingTop: 40,
  },
  streakTextContainer: {
    position: 'absolute',
    paddingTop: 140,
  },
  editButtonContainer: {
    position: 'absolute',
    paddingLeft: 300,
    paddingTop: 170,
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
    paddingRight: 20,
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