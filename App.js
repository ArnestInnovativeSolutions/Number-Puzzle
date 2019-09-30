
import React, { Fragment, Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Storage from './Storage';
import { thisTypeAnnotation } from '@babel/types';


export default class Hello extends Component {

    constructor() {
        super();
        this.state = {
            stats: {
                time: 0,
                moves: 0
            },//await this.GetData(),
            timer: {
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            analytics: {
                moves: 0,
                started: new Date().getTime(),
                invalidMoves: 0,
                completedOn: undefined,
            },
            data: [
                [
                    {
                        "row": null,
                        "col": null,
                        "value": 1,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 2,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 3,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 4,
                        "isCorrect": true
                    }

                ],
                [
                    {
                        "row": null,
                        "col": null,
                        "value": 5,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 6,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 7,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 8,
                        "isCorrect": true
                    }
                ],
                [
                    {
                        "row": null,
                        "col": null,
                        "value": 9,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 10,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 11,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 12,
                        "isCorrect": true
                    }
                ],
                [
                    {
                        "row": null,
                        "col": null,
                        "value": 13,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 14,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 15,
                        "isCorrect": true
                    },
                    {
                        "row": null,
                        "col": null,
                        "value": 0,
                        "isCorrect": true
                    },
                ]]
        }
        this.GetData();
        

    }

    generateRandomValue = () => {
        var min = 0, max = 16;
        var rand = Math.ceil(Math.random() * (max - min) + min);
        return rand
    }

    shuffleBoard = () => {
        // arraryobject to keep assigned values
        // function to give random value between 0 and 15
        let randomValues = [];
        let val, rand;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                rand = this.generateRandomValue();
                if (randomValues.includes(rand)) {
                    do {
                        rand = this.generateRandomValue();
                    }
                    while (randomValues.includes(rand))
                    randomValues.push(rand)
                    val = rand;
                }
                else {
                    randomValues.push(rand)
                    val = rand;
                }

                //  this.state.data[row][col].row = row;
                //  this.state.data[row][col].col = col;
                if (val == 16) val = 0;
                this.setValue(row, col, val)
            }
        }
        this.setState(this.state);
        clearInterval(this.intervalID);
        this.state.timer.minutes = 0;
        this.state.timer.seconds = 0;
        this.setState(this.state.timer)
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );

    }

    setValue(row, col, val) {
        // set value in x, y
        // is in correct position
        // is in wrong position
        // is blank?
        this.state.data[row][col].value = val;
        let correctValue = (row * 4) + col + 1;
        this.state.data[row][col].isCorrect = (row == 3 && col == 3 && val == 0) ? true : (correctValue == val);
        return this.state.data[row][col];
    }

    move(row, col) {
        // get x and y from cellObj
        // can move?: find where to move, by checking NEWS
        // no?: no chane
        // yes: change value by using set value
        // isfinished
        // show success message
        this.state.analytics.moves = this.state.analytics.moves + 1;
        let selectedCell = this.state.data[row][col];
        let canMove = true;
        if (selectedCell.value == 0) {
            // cant move
            canMove = false;
        }

        let targetCellX = row;
        let targetCellY = col;
        if (row > 0 && this.state.data[row - 1][col].value == 0) {
            // can move only up
            // get top
            targetCellX = row - 1;
        } else if (row < 3 && this.state.data[row + 1][col].value == 0) {
            // can move only down
            targetCellX = row + 1;
        } else if (col > 0 && this.state.data[row][col - 1].value == 0) {
            // can move only left
            targetCellY = col - 1;
        } else if (col < 3 && this.state.data[row][col + 1].value == 0) {
            // can move only right
            targetCellY = col + 1;
        } else {
            // cant move
            canMove = false;

        }

        if (canMove) {
            //alert('Moving to ' + targetCellX + ',' + targetCellY);
            //ToastAndroid.show('Moving to ' + targetCellX + ',' + targetCellY, ToastAndroid.SHORT);
            this.setValue(targetCellX, targetCellY, selectedCell.value);
            this.setValue(row, col, 0);
            this.setState(this.state);
            this.isFinished();
            return
        } else {
            // show message/viber/warn
            ToastAndroid.show('Wrong Move!', ToastAndroid.SHORT)
            this.state.analytics.invalidMoves = this.state.analytics.invalidMoves + 1;
        }
        this.setState(this.state.analytics);


    }

    isFinished() {
        // check all are in right position
        let movesLeft = 0;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.state.data[row][col].isCorrect == false) {
                    return;
                    //movesLeft = movesLeft + 1;
                }
            }
        }
        if (movesLeft == 0) {
            clearInterval(this.intervalID);
            this.state.timer.hours = 0;
            this.state.timer.minutes = 0;
            this.state.timer.seconds = 0;
            this.setState(this.state.timer)
            ToastAndroid.show('Congragulations! you Won', ToastAndroid.LONG)
            this.Storage();
        }
    }
    tick() {
        if (this.state.timer.seconds < 60) {
            this.state.timer.seconds = this.state.timer.seconds + 1
        }
        else {
            this.state.timer.seconds = 0;
            this.state.timer.minutes = this.state.timer.minutes + 1
        }

        this.setState(
            this.state.timer);

    }

    storeData = async (result) => {
        try {
            await AsyncStorage.setItem('@BestResult', JSON.stringify(result))
        } catch (e) {
            console.log(e)
        }
    }
    GetData = () => {
        try {
            AsyncStorage.getItem('@BestResult', (err, result) => {
                if(result == null)
                {
                    this.state.stats.time = 0
                    this.state.stats.moves = 0
                }
                else{
                    this.state.stats = JSON.parse(result);
                }
                this.setState(this.state.stats);

            });
        } catch (e) {
            console.log(e)
        }

    }
    removeValue = async () => {
        try {
            await AsyncStorage.removeItem('@BestResult')
           // this.setState({stats:temp})
        } catch (e) {
            console.log(e)
        }

    }
    Storage = async () => {
        currentTime = String(this.state.timer.hours) + ':' + String(this.state.timer.minutes) + ':' + String(this.state.timer.minutes);
        if(this.state.stats.time!= 0){
        if (Date.parse(currentTime) < Date.parse(String(this.state.stats.time))) {
            let result = {
                time: currentTime,
                moves: this.state.analytics.moves
            }
            await this.removeValue();
            await this.storeData(result);
        }
        }
        else
        {
            let result = {
                time: currentTime,
                moves: this.state.analytics.moves
            }
            await this.removeValue();
            await this.storeData(result);
        }
    }
    render() {

        return (
            <>
                <Text style={{ fontSize: 22, color: 'black', alignItems: 'flex-start' }}>
                    {this.state.timer.minutes}:{this.state.timer.seconds}
                </Text>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'white' }}>
                    <View style={{ margin: 10 }}>
                        <Button
                            title="Play"
                            color='steelblue'
                            onPress={() => this.shuffleBoard()}
                        />
                    </View>
                    {
                        this.state.data.map((item, i) => (
                            <View style={{ flexDirection: 'row' }} key={i}>
                                {
                                    item.map((rowValues, k) => (
                                        <View key={(i * 4) + (k + 1)}>
                                            <TouchableOpacity style={{
                                                backgroundColor: (rowValues.value == 0) ? 'gray' : (rowValues.isCorrect == true) ? 'skyblue' : 'powderblue',
                                                borderColor: 'black',
                                                borderWidth: 2,
                                                height: 100,
                                                marginRight: -1,
                                                marginTop: -1,
                                                marginBottom: -1,
                                                marginLeft: -1,
                                                padding: 0,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 100,
                                            }}
                                                onPress={() => this.move(i, k)} >
                                                <Text style={{ fontSize: 32, color: 'black', fontWeight: 'bold' }} >{(rowValues.value == 0) ? " " : rowValues.value}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                    )
                                }
                            </View>
                        ))
                    }

                </View>
                <View style={{ alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 20, color: 'black' }}>Timetaken:{this.state.stats.time}</Text>
                    <Text style={{ fontSize: 20, color: 'black' }}>Moves:{this.state.stats.moves}</Text>
                </View>

            </>
        )
    }
}
