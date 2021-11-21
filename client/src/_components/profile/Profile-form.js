import { Layout , Form, Avatar, Input, DatePicker, Button} from 'antd';
import { ConsoleSqlOutlined, UserOutlined} from '@ant-design/icons';
import moment from 'moment';
import {useEffect} from 'react';
import { pickBy, identity } from 'lodash';
import {useRecoilState} from 'recoil';


import { useProfileAction } from '_actions';
import { alertBachAtom } from '_state';


export{ ProfileForm}

const Background = {
    backgroundImage : `url(${"https://user-images.githubusercontent.com/513929/53929982-e5497700-404c-11e9-8393-dece0b196c98.png"})`,
    backgroundSize : 'cover',
    backgroundPosition: 'center',
    height : '200px',
}
const avatarStyle = {
    backgroundColor: '#87d068',
    height: '100px',
    width: '100px',
    position: 'relative',
    top: '32%',
    left: '50%',
    transform: "translate(-50%, -50%)",
}

const dateFormat = 'DD/MM/YYYY';

const { Header, Content } = Layout;


function ProfileForm(props) {
    const profileAction = useProfileAction(); 
    const [form] = Form.useForm();
    const [alert, setAlert] = useRecoilState(alertBachAtom);

    let data = props.data;
    let isTable = props.isTable;
    console.log(data);

    if (data == null) {
        profileAction.getMyProfile().then( newData =>{
                console.log('set new data here!!!!!');
                data = newData;
            }
        )
    }

    useEffect (() => {
        if (data !== undefined){
            // data = profile;
            form.resetFields();
        }
    },[data])

    // useEffect (() => {
    //     form.resetFields();
    // },[data])

    function formatDate(timestamp) {
        let formatedDateOfBirth = moment.utc(timestamp).format("DD/MM/YYYY") ;
        return formatedDateOfBirth
    }

    const cancelEdit = () => {
        setAlert({message: "Thành công", description: "Đã cập nhật lại các thông tin !"});
        form.resetFields();
    }     

    const handleSubmit = () => {
       form.validateFields()
        .then((values) => {
        //   form.resetFields();
          const changedFields =  pickBy(values, identity);
          if(changedFields.date_of_birth) {
                let timestamp = moment(changedFields.date_of_birth, 'DD/MM/YYYY').format('x');
                console.log(timestamp);
                changedFields.date_of_birth = timestamp;
          }
          console.log(changedFields);
          profileAction.handleSubmit(changedFields, data.vnu_id, isTable);
        }).catch((e) => {
            setAlert({message: "Lỗi", description: e});
          });
    }

    return (
        (data)?
       
        <Layout>
            <Header style ={Background}> </Header>
            <Content>
                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    form = {form}
                >
                    <Avatar
                        style={avatarStyle}
                        src = {"https://vn.portal-pokemon.com/play/resources/pokedex/img/pm/70a91d7bed9893ec5e1bff2f44c52178a41f74e0.png"}
                        icon={<UserOutlined />}
                    />
                    <br/>
                    <Form.Item label="Name" name = "name">
                        <Input defaultValue = {data.name} />
                    </Form.Item>
                    <Form.Item label="Vnu_id" name = "vnu_id">
                        <Input defaultValue = {data.vnu_id} />
                    </Form.Item>
                    <Form.Item label="Date of Birth " name = "date_of_birth">
                        <DatePicker defaultValue={moment(formatDate(data.date_of_birth), dateFormat)} format={dateFormat} />
                    </Form.Item>
                    <Form.Item label="Email" name = "email">
                        <Input defaultValue = {data.email} />
                    </Form.Item>
                    <Form.Item label=" " colon={false}>
                        <Button type="primary" htmlType="submit" onClick = {handleSubmit}>
                            Submit
                        </Button>

                        <Button onClick = {cancelEdit} style = {{position : 'relative', left : '40px'}}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
            
        </Layout> 
        :<></>
    )
}