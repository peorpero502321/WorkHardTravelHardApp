import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from 'react-native';
import { theme } from './colors';

export default function App() {
	const [working, setWorking] = useState(true);
	const [text, setText] = useState('');
	const [toDos, setToDos] = useState({});
	const travel = () => setWorking(false);
	const work = () => setWorking(true);
	const onChangeText = (payload) => setText(payload);
	const addTodo = () => {
		if (text === '') {
			return;
		}
		/* const newToDos = Object.assign({}, toDos, {
			[Date.now()]: { text, work: working },
		}); */
		const newToDos = { ...toDos, [Date.now()]: { text, work: working } };
		setToDos(newToDos);
		console.log('왜안지워 지니?? ' + text);
		setText('');
		ref.current.clear();
	};

	console.log(toDos);
	return (
		<View style={styles.container}>
			<StatusBar style='auto' />
			<View style={styles.header}>
				<TouchableOpacity onPress={work}>
					<Text
						style={{
							...styles.btnText,
							color: working ? 'white' : theme.grey,
						}}>
						Work
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={travel}>
					<Text
						style={{
							...styles.btnText,
							color: working ? theme.grey : 'white',
						}}>
						Travel
					</Text>
				</TouchableOpacity>
			</View>
			<TextInput
				onSubmitEditing={addTodo}
				returnKeyType='done'
				onChangeText={onChangeText}
				placeholder={working ? 'Add a to DO' : 'Where do you'}
				style={styles.input}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.bg,
		paddingHorizontal: 20,
	},
	header: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginTop: 100,
	},
	btnText: {
		fontSize: 38,
		fontWeight: '600',
		color: theme.grey,
	},
	input: {
		backgroundColor: 'white',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 30,
		marginTop: 20,
		fontSize: 18,
	},
});
