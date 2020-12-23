// @ts-nocheck
// @ts-ignore
import * as React from 'react';
import { Form, Input, Button } from 'antd';
import { firestore } from '../lib/firestore';
import { useEffect, useState } from 'react';
import { test } from '../models/test';
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
export interface ICreatePointPageProps {
}
export const CreatePointPageFn = () => {
    const [Groups, setGroups] = useState([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        let final = [];
        await firestore.collection('Groups').onSnapshot((snap) => {
            snap.forEach((doc) => {
                final.push(doc.data())
            })
        })
        setGroups(final)
        console.log(final);
        console.log(Groups)
    }, [Groups])
    return (<>{JSON.stringify(Groups)}</>);
}
export default class CreatePointPage extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            id: '213213',
            cookies: '',
            balance: '',
            Groups: []
        }
    }
    async componentDidMount() {

        let final = [];
        await firestore.collection('Groups').onSnapshot((snap) => {
            snap.forEach((doc) => {
                final.push(doc.data())
            })
        })
        this.setState({ Groups: final });


    }

    render() {
        return (
            <div >
                <h2 onClick={(e) => { this.setState({ id: "13221312323" }) }}>Сейчас {this.state.id}.</h2>
                <h1>Список групп </h1>
                <div>
                    <h2>Сейчас {JSON.stringify(this.state.Groups)}.</h2>
                </div>
            </div>
        );
    }
}
{/* 
                <Form {...layout} name="control-hooks">
                    <Form.Item name="ID Группы" label="ID Группы" rules={[{ required: true }]}>
                        <Input value='123' />
                    </Form.Item>
                    <Form.Item name="note" label="Cookies пользователя" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="note" label="Баланс робобаксов" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                    >
                        {({ getFieldValue }) => {
                            return getFieldValue('gender') === 'other' ? (
                                <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            ) : null;
                        }}
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Создать
        </Button>

                    </Form.Item>

                </Form> */}