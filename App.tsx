import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [data, setData] = useState([
    { type: 'header', key: 'your', id: '0' },
    { type: 'header', key: 'habits', count: 4, id: '1' }, // Streak can be added back if needed
    { type: 'time', hours: 0, minutes: 0, seconds: 0, id: '2' },
    { type: 'habit', key: 'Workout', id: '3' },
    { type: 'habit', key: 'Read for 30 minutes', id: '4' },
    { type: 'create', id: '5'},
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
        <View style={styles.cardContainer}>
          <View style={styles.habitTextContainer}>
            <Text style={styles.cardText}>{item.key}</Text>
          </View>
          <View style={styles.streakTextContainer}>
            <Text style={[styles.cardText, {fontSize: 40}]}>23</Text>
            <Text style={[styles.cardText, {fontSize: 20}]}>day streak</Text>
          </View>
          <View style={styles.editButtonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => alert('Edit ' + item.key)}>
              <Icon name="create-outline" size={35} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (item.type === 'create') {
      return (
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={() => alert('Edit ' + item.key)}>
            <Icon name="create" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )
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
    width: 430,
    height: 430,
    backgroundColor: 'plum',
    borderRadius: 50,
    marginLeft: -15,

  },
  cardTextContainer: {
    width: 300,
  },
  cardText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    paddingTop: 0,
    paddingLeft: 15,
  },
  separator: {
    height: 5,
  },
  editButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'relative', // Allows absolute positioning of the bubble
  },
  streakBubble: {
    position: 'absolute',
    right: 30,
    bottom: 0,
    backgroundColor: 'darkslategrey', // Bubble color
    borderRadius: 45, // Half of width/height for a circle
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    color: 'white',
    fontSize: 50, // Large number
    fontWeight: 'bold',
  },
  habitTextContainer: {
    paddingTop: 40,
  },
  streakTextContainer: {
    position: 'absolute',
    paddingTop: 180, 
  },
  editButtonContainer: {
    position: 'absolute',
    paddingTop: 320, 
    paddingLeft: 10,
  },
  createButtonContainer: {
    alignItems: 'flex-end',
  },
  createButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'deepskyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});