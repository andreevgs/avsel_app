import React, {useEffect, useState} from 'react';
import {Card, Col, Row, Typography, Modal, Form, Input, message} from "antd";
import {DeleteOutlined, EditOutlined, StopOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getOffers} from "../../../redux/actions/account";
import {deleteOffer} from "../../../redux/actions/offers";

const {Title, Text} = Typography;

const RejectedOffers = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {offers} = useSelector(state => state.account);
    const {isAuthenticated} = useSelector(state => state.auth);

    const [offerIdForDelete, setOfferIdForDelete] = useState(null);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Are you sure you want to delete this offer?');

    const showModal = (offerId) => {
        setOfferIdForDelete(offerId);
        setVisible(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        dispatch(deleteOffer(offerIdForDelete))
            .then(() => {
                dispatch(getOffers('rejected'))
                    .then(() => {
                        message.success('offer successfully deleted');
                        setVisible(false);
                        setConfirmLoading(false);
                    })
                    .catch(errorText => {
                        setVisible(false);
                        setConfirmLoading(false);
                        message.error(errorText);
                    });
            })
            .catch(errorText => {
                setVisible(false);
                setConfirmLoading(false);
                message.error(errorText);
            });
    };

    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        dispatch(getOffers('rejected'))
            .catch(errorText => {
                message.error(errorText);
            });
    }, []);

    const rejectionInfo = () => {
        Modal.error({
            title: 'Details about rejection',
            content: (
                <div>
                    <p>Your offer was rejected. Details were sent to your email. Please upload your photos and submit
                        for re-moderation.</p>
                </div>
            ),
            onOk() {
            },
        });
    }

    return (
        <div className="site-layout-content">
            <Modal
                title="Confirm deletion"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{modalText}</p>
            </Modal>
            <Title level={5} style={{marginBottom: '20px'}}>Rejected offers: {offers ? offers.length : ''}</Title>
            <Row gutter={[16, 24]}>
                {offers && offers.map((offer) => {
                    return (
                        <Col
                            key={offer.id}
                            className="gutter-row"
                            xs={32}
                            lg={8}
                            style={{width: '100%'}}
                        >
                            <Card
                                cover={
                                    <img
                                        alt="example"
                                        src={`http://localhost:3000/uploads/${offer.images[0]['name']}`}
                                        style={{width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer'}}
                                        onClick={() => navigate(`/cars/${offer.id}`)}
                                    />
                                }
                                actions={[
                                    <EditOutlined onClick={() => navigate(`/cars/${offer.id}/edit`)} key={'edit'}/>,
                                    <DeleteOutlined onClick={() => {showModal(offer.id)}} key={'delete'}/>,
                                    <InfoCircleOutlined style={{color: 'red'}} key={'details'} onClick={rejectionInfo}/>
                                ]}
                            >
                                <Row gutter={[0, 8]}>
                                    <Col style={{fontSize: '16px'}} span={24} className="gutter-row">
                                        <Text strong>
                                            {`${offer.mark.name} ${offer.model.name} ${offer.generation.generation}`}
                                        </Text>
                                    </Col>
                                    <Col style={{fontSize: '16px'}} span={24} className="gutter-row">
                                        <Text type="success">120000 USD</Text>
                                    </Col>
                                    <Col style={{fontSize: '16px'}} span={24} className="gutter-row">
                                        <Text>60000 miles</Text>
                                    </Col>
                                    <Col span={24} className="gutter-row">
                                        <Text type="secondary">{offer.description}</Text>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
};

export default RejectedOffers;