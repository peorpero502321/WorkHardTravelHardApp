import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Fontisto } from '@expo/vector-icons';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Alert,
} from 'react-native';
import { theme } from './colors';

const STORAGE_KEY = '@toDos';

export default function App() {
	const [working, setWorking] = useState(true);
	const [text, setText] = useState('');
	const [toDos, setToDos] = useState({});
	const [dataLoad, setDataLoad] = useState(false);
	useEffect(() => {
		loadToDos();
		changeScreenOrientation();
		ScreenOrientation.getOrientationAsync().then((data) => {
			console.log(data);
		})
	}, []);
	const travel = () => setWorking(false);
	const work = () => setWorking(true);
	const setRef = useRef();

	// 화면레프트 고정
	async function changeScreenOrientation() {
		await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
	}

	// 스토리지에 toDos 저장하기
	const saveToDos = async (toSave) => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
		} catch (e) {
			console.log('스토리지 저장실패' + e);
		}
	};
	// 스토리지에 넣은 toDos 가져오기
	const loadToDos = async () => {
		try {
			const s = await AsyncStorage.getItem(STORAGE_KEY);
			if (s) {
				setToDos(JSON.parse(s));
			}
			setDataLoad(true);
		} catch (e) {
			console.log('스토리지 불러오기 실패 ' + e);
		}
	};

	// 텍스트 입력 받기
	const onChangeText = (payload) => {
		setText(payload);
	};

	// 키보드의 done으로 입력 받은 텍스트 toDo Object 에 합치기
	const addTodo = async () => {
		if (text === '') {
			return;
		}
		/* const newToDos = Object.assign({}, toDos, {
			[Date.now()]: { text, work: working },
		}); */

		// 기존 toDos list 에 세로운 오브젝트 생성 날짜 값키로 잡아서 새로 들어온 텍스트 넣고 list로 만들기
		const newToDos = { ...toDos, [Date.now()]: { text, working } };

		// toDos list 업데이트
		setToDos(newToDos);
		await saveToDos(newToDos);

		// ref를 이용하여 input의 내용 지워주기!
		setRef.current.clear();
	};

	const deleteToDo = async (key) => {
		Alert.alert('삭제', 'ToDo를 삭제하시겠습니까?', [
			{ text: '취소' },
			{
				text: '확인',
				onPress: async () => {
					const newToDos = { ...toDos };
					delete newToDos[key];
					setToDos(newToDos);
					await saveToDos(newToDos);
				},
			},
		]);
		return;
	};
	return (
		<View style={styles.container}>
			<StatusBar style='auto' />
			{dataLoad ? (
				<View style={{ flex: 1 }}>
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
						ref={setRef}
						onSubmitEditing={addTodo}
						returnKeyType='done'
						onChangeText={onChangeText}
						placeholder={working ? '오늘 해야할일' : '가고 싶은 곳'}
						style={styles.input}
					/>
					<ScrollView>
						{Object.keys(toDos).map((key) =>
							toDos[key].working === working ? (
								<View style={styles.toDo} key={key}>
									<Text style={styles.toDoText}>{toDos[key].text}</Text>
									<TouchableOpacity onPress={() => deleteToDo(key)}>
										<Fontisto name='trash' size={18} color={theme.grey} />
									</TouchableOpacity>
								</View>
							) : null
						)}
					</ScrollView>
				</View>
			) : (
				<View style={styles.activityIndicator}>
					<ActivityIndicator color='white' style={{ flex: 1 }} />
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.bg,
		paddingHorizontal: 20,
	},
	activityIndicator: {
		flex: 1,
		alignItems: 'center',
	},
	header: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginTop: 20,
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
		marginVertical: 20,
		fontSize: 18,
	},
	toDo: {
		backgroundColor: theme.toDoBg,
		marginBottom: 10,
		paddingVertical: 20,
		paddingHorizontal: 40,
		borderRadius: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	toDoText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '500',
	},
});
