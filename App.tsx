import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';


export default function App() {
  const [Hours, setHours] = useState(0);
  const [Minutes, setMinutes] = useState(0);
  const [Seconds, setSeconds] = useState(0);
  const [data, setData] = useState ([
    { key: 'Workout', id: '1' },
    { key: 'Read for 30 minutes', id: '2' },
    
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor(((diff % (1000 * 60 * 60)) % (1000 * 60)) / 1000);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          <Text style={styles.text}>Your</Text>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Habits </Text>
            <Text style={styles.normalText}>(4)</Text>
          </Text>
          <Text style={styles.bedtimeText}>{Hours}h {Minutes}m {Seconds}s</Text>
          <View style={styles.habitListContainer}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>{item.key}</Text>
                  </View>
                  <TouchableOpacity style={styles.editButton} onPress={() => alert('Edit ' + item.key)}>
                      <Icon name="pencil" size={20} color="white" />
                    </TouchableOpacity>
                </View>
              )}
              ItemSeparatorComponent={renderSeparator}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)',

  },
  list: {
    paddingLeft: 20,
  },
  item: {
    backgroundColor: 'plum',
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 30,
    fontWeight: 'bold',
    margin: 5,
  },
  habitListContainer: {
    paddingTop: 40,
    marginLeft: -15
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 45,
  },
  bedtimeText: {
    paddingTop: 0,
    color: 'black',
    fontSize: 25,
  },
  cardContainer: {
    width: 430,
    height: 420,
    backgroundColor: 'plum',
    borderRadius: 50,
  },
  cardTextContainer: {
    width: 300,
  },
  cardText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    paddingTop: 50,
    paddingLeft: 15,
  },
  separator: {
    height: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  normalText: {
    fontWeight: 'normal',
  },
  editButton: {
    position: 'absolute',
    bottom: 15,
    left: 15, 
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'deepskyblue', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});
