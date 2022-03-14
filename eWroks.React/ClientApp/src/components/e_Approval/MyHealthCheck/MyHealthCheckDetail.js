import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { Form, Col, Card, Button, Breadcrumb, Tabs, Tab, Modal, Table } from 'react-bootstrap';

import GDHSelectOption from '../../common/controls/GDHSelectOption';
import GDHDatepicker from '../../common/controls/GDHDatepicker';


class MyHealthCheckDetail extends Component {
    state = {
        hrHealthCheckDto: {
              healthId: 0
            , registerDt: new Date()
            , agreeYn: false
            , temperatureVal: '0'
            , confirmerContactCd: ''
            , confirmerContactReason: ''
            , infectedCd: ''
            , etcReason: ''
            , regId: ''
            , updId: ''
        },
        itemSymptom01: false,
        itemSymptom02: false,
        itemSymptom03: false,
        itemSymptom04: false,
        itemSymptom10: false,
        itemSymptomDtlCd: '',

        confirmerContactCd01: false,
        confirmerContactCd02: false,
        confirmerContactCd03: false,

        infectedCd01: false,
        infectedCd02: false,
    }
     /*==========================================================*/
	/* Page Load    */
	/*==========================================================*/
    componentDidMount() {
        if (this.props.id !== '') {
            this.props.onIsLoadingTrue();
            axios.get(this.props.storeState.serviceUrl + "/HrHealthCheckService/GetHrHealthCheckDetail", {
                params: {
                    healthId: this.props.id
                }
            }).then(r => {
                this.props.onIsLoadingFalse();
                var data = r.data;

                data.hrHealthCheckDto.agreeYn = data.hrHealthCheckDto.agreeYn === 'Y' ? true : false;

                this.setState({
                    hrHealthCheckDto: data.hrHealthCheckDto,

                    confirmerContactCd01: data.hrHealthCheckDto.confirmerContactCd === '01' ? true : false,
                    confirmerContactCd02: data.hrHealthCheckDto.confirmerContactCd === '02' ? true : false,
                    confirmerContactCd03: data.hrHealthCheckDto.confirmerContactCd === '03' ? true : false,

                    infectedCd01: data.hrHealthCheckDto.infectedCd === '01' ? true : false,
                    infectedCd02: data.hrHealthCheckDto.infectedCd === '02' ? true : false,
                });

                for (var i = 0; i < data.hrHealthCheckItemDtos.length; i++) {
                    var dr = data.hrHealthCheckItemDtos[i];
                    if (dr.itemType === '0056')
                    {
                        if (dr.itemCd === '01') { this.setState({ itemSymptom01: true, itemSymptomDtlCd: dr.itemDtlCd }) }
                        if (dr.itemCd === '02') { this.setState({ itemSymptom02: true, itemSymptomDtlCd: dr.itemDtlCd }) }
                        if (dr.itemCd === '03') { this.setState({ itemSymptom03: true, itemSymptomDtlCd: dr.itemDtlCd }) }
                        if (dr.itemCd === '04') { this.setState({ itemSymptom04: true, itemSymptomDtlCd: dr.itemDtlCd }) }
                        if (dr.itemCd === '10') { this.setState({ itemSymptom10: true, itemSymptomDtlCd: '' }) }
                    }
                }

            }).catch(function (error) {
                alert(error);
            });
        }
    }

    /*==========================================================*/
    /* 저장    */
    /*==========================================================*/
    saveHealthCheck() {
        // 마스터 설정
        var _userId = this.props.storeState.userInfo.userId;
        var gParam = { ...this.state.hrHealthCheckDto }
        
        gParam.registerDt = this.props.storeState.getParsedDate(gParam.registerDt);
        gParam.agreeYn = gParam.agreeYn ? "Y" : "N";
        if (gParam.agreeYn === "N") {
            alert("개인정보 제공 동의 후 진행 바랍니다.")
            return;
        }
        if(gParam.temperatureVal === "0") {
            alert('1. 체온값을 정확히 입력해 주세요.')
            return;
        }
        gParam.temperatureVal = Number(gParam.temperatureVal);
        gParam.confirmerContactCd = this.state.confirmerContactCd01 ? "01"
            : this.state.confirmerContactCd02 ? "02" 
            : this.state.confirmerContactCd03 ? "03" 
            : "";
        gParam.confirmerContactReason = gParam.confirmerContactCd === "01" ? gParam.confirmerContactReason : "";
        if (gParam.confirmerContactCd === "") {
            alert("3. 최근 14일 이내 확진자와 접촉 유무를 체크해 주세요.")
            return;
        }
        else {
            if (gParam.confirmerContactCd === '01' && gParam.confirmerContactReason === "") {
                alert("3. 최근 14일 이내 확진자와 접촉 유무 - 지역명을 입력해 주세요.")
                return;
            }
        }
        gParam.infectedCd = this.state.infectedCd01 ? "01"
            : this.state.infectedCd02 ? "02"
            : "";

        if (gParam.infectedCd === "") {
            alert("4. 본인 또는 동거인 자가격리여부를 체크해 주세요.")
            return;
        }
        gParam.regId = _userId;
        gParam.updId = _userId;

        var gParamItems = [];
        if(this.state.itemSymptom01) {
            gParamItems.push({
                healthId: 0, ItemId: 0, ItemType: '0056', ItemCd: "01", ItemDtlCd: this.state.itemSymptomDtlCd, ItemDtlReason: "", RegId: _userId, UpdId: _userId
            });
        }
        if(this.state.itemSymptom02) {
            gParamItems.push({
                healthId: 0, ItemId: 0, ItemType: '0056', ItemCd: "02", ItemDtlCd: this.state.itemSymptomDtlCd, ItemDtlReason: "", RegId: _userId, UpdId: _userId
            });
        }
        if(this.state.itemSymptom03) {
            gParamItems.push({
                healthId: 0, ItemId: 0, ItemType: '0056', ItemCd: "03", ItemDtlCd: this.state.itemSymptomDtlCd, ItemDtlReason: "", RegId: _userId, UpdId: _userId
            });
        }
        if(this.state.itemSymptom04) {
            gParamItems.push({
                healthId: 0, ItemId: 0, ItemType: '0056', ItemCd: "04", ItemDtlCd: this.state.itemSymptomDtlCd, ItemDtlReason: "", RegId: _userId, UpdId: _userId
            });
        }
        if(this.state.itemSymptom10) {
            gParamItems.push({
                healthId: 0, ItemId: 0, ItemType: '0056', ItemCd: "10", ItemDtlCd: "", ItemDtlReason: "", RegId: _userId, UpdId: _userId
            });
        }
        
        var gParamGroup = {
            hrHealthCheckDto: gParam,
            hrHealthCheckItemDtos: gParamItems
        }
        

        axios.post(this.props.storeState.serviceUrl + "/HrHealthCheckService/SaveHealthCheck",
        gParamGroup)
            .then(r => {
                var data = r.data;
                if (data.oV_RTN_CODE === -1) {
                    alert(data.oV_RTN_MSG);
                    return;
                }
                this.props.saveCallback();
            }).catch(function (error) {
                alert(error);
            });
    }
    /*==========================================================*/
    /* 신규생성    */
    /*==========================================================*/
    onClickNew() {
        this.props.onClickNew();
    }
    // 체인지 공통
    onChangeHandler(e) {
        this.setState({
            hrHealthCheckDto: {
                ...this.state.hrHealthCheckDto,
                [e.target.name]: e.target.value
            }
        });
    }
    onChangeItemHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onDateChange(name, date) {
        this.setState({
            hrHealthCheckDto: {
                ...this.state.hrHealthCheckDto,
                [name]: date
            }
        });
    }
    render() {
        return (<>
          <Card>
                <Card.Header>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12 text-right">
                                <Button variant="secondary" onClick={this.onClickNew.bind(this)}>Add</Button>{' '}
                                <Button variant="success" id="btnSave"
                                    onClick={this.saveHealthCheck.bind(this)}
                                >Save</Button>
                            </div>
                        </Form.Row>
                    </Form>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <div className="col-md-12" style={{ marginBottom: 10 }}>
                                <Table bordered>
                                    <colgroup>
                                        <col style={{ width: 150 }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Employee Nm</th>
                                            <td>{this.props.storeState.userInfo.userNm}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Department</th>
                                            <td>{this.props.storeState.userInfo.deptFullNm}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Position Kr</th>
                                            <td>{this.props.storeState.userInfo.dutyCdKorNm}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: '#e9ecef' }}>Register Dt</th>
                                            <td>
                                                <GDHDatepicker
                                                    name='startDt'
                                                    value={this.state.hrHealthCheckDto.registerDt} onDateChange={this.onDateChange.bind(this)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                           
                        </Form.Row>
                    </Form>
                    <Card border="warning">
                        <Card.Header style={{ fontSize: 13, fontWeight: 'bold' }} > 개인 건강점검 설문지</Card.Header>
                        <Card.Body style={{ fontSize: 13 }}>
                            <Card.Text>
                                전염성 바이러스 확산을 방지하고 직원분들의 건강을 보호하기 위해, 회사는 개인 건강
                                상태의 대한 정보를 수집하고 필요시 질병관리본부에 관련 자료를 제공할 수 있습니다.
                                다음 질문에 정직한 답변을 요청드리며, 제공된 정보는 기밀로 취급 및 다른 목적으로
                                사용되지 않으며, 일정기간 보관 후 삭제합니다.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer style={{ textAlign: 'center' }}>
                            <Form.Group controlId="agreeYn" style={{ fontSize: 15, fontWeight: 'bold' }}>
                                <Form.Check inline type="checkbox" label="위와 같은 이유로 개인정보 제공을 동의합니다."
                                    checked={this.state.hrHealthCheckDto.agreeYn}
                                    onChange={(e) => {
                                        this.setState({
                                            hrHealthCheckDto: {
                                                ...this.state.hrHealthCheckDto,
                                                agreeYn: e.target.checked
                                            }
                                        });
                                    }}
                                />
                            </Form.Group>
                        </Card.Footer>
                    </Card>
                    <Card border="warning" style={{ marginTop: 15 }}>
                        <Card.Header style={{ fontSize: 13, fontWeight: 'bold' }}> 1. 체온</Card.Header>
                        <Card.Body style={{ fontSize: 13 }}>
                            <Form.Group>
                                <Form.Control as="select" size="sm"
                                    name="temperatureVal"
                                    value={this.state.hrHealthCheckDto.temperatureVal}
                                    onChange={this.onChangeHandler.bind(this)}>
                                    <option value="0">== 온도를 선택해 주세요 ==</option>
                                    <option value="35">35℃ / 95℉</option>
                                    <option value="35.5">35.5℃ / 95.9℉</option>
                                    <option value="36">36℃ / 96.8℉</option>
                                    <option value="36.5">36.5℃ / 97.7℉</option>
                                    <option value="37">37℃ / 98.6℉</option>
                                    <option value="37.5">37.5℃ / 99.5℉</option>
                                    <option value="38">38℃ / 100.4℉</option>
                                    <option value="38.5">38.5℃ / 101.3℉</option>
                                    <option value="39">39℃ / 102.2℉</option>
                                </Form.Control>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <Card border="warning" style={{ marginTop: 15 }}>
                        <Card.Header style={{ fontSize: 13, fontWeight: 'bold' }}> 2. 다음 증상이 있습니까?</Card.Header>
                        <Card.Body style={{ fontSize: 13 }}>
                            <Form.Group controlId="itemSymptom01">
                                <Form.Check inline type="checkbox" label="발열(고열)"
                                    checked={this.state.itemSymptom01}
                                    onChange={(e) => {
                                        this.setState({
                                            itemSymptom01: e.target.checked,
                                            itemSymptom10: false
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="itemSymptom02">
                                <Form.Check inline type="checkbox" label="호흡기 질환(기침, 인후통, 호흡곤란)"
                                    checked={this.state.itemSymptom02}
                                    onChange={(e) => {
                                        this.setState({
                                            itemSymptom02: e.target.checked,
                                            itemSymptom10: false
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="itemSymptom03">
                                <Form.Check inline type="checkbox" label="설사/ 구토/ 기타"
                                    checked={this.state.itemSymptom03}
                                    onChange={(e) => {
                                        this.setState({
                                            itemSymptom03: e.target.checked,
                                            itemSymptom10: false
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="itemSymptom04">
                                <Form.Check inline type="checkbox" label="후각/ 미각 소실"
                                    checked={this.state.itemSymptom04}
                                    onChange={(e) => {
                                        this.setState({
                                            itemSymptom04: e.target.checked,
                                            itemSymptom10: false
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="itemSymptom10">
                                <Form.Check inline type="checkbox" label="해당 사항 없음"
                                    checked={this.state.itemSymptom10}
                                    onChange={(e) => {
                                        this.setState({
                                            itemSymptom01: false,
                                            itemSymptom02: false,
                                            itemSymptom03: false,
                                            itemSymptom04: false,
                                            itemSymptom10: e.target.checked,
                                            itemSymptomDtlCd: ''
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group style={{
                                display: 
                                this.state.itemSymptom01 || this.state.itemSymptom02 || this.state.itemSymptom03 || this.state.itemSymptom04 ? 'inline' : 'none'
                            }}>
                                <Form.Control as="select" size="sm"
                                    name="itemSymptomDtlCd"
                                    value={this.state.itemSymptomDtlCd}
                                    onChange={this.onChangeItemHandler.bind(this)}>
                                    <GDHSelectOption cdMajor="0055" deleteMinor={[]} isEmpty={true} isEmptyText="== 병원에 방문했습니까? ==" />
                                </Form.Control>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <Card border="warning" style={{ marginTop: 15 }}>
                        <Card.Header style={{ fontSize: 13, fontWeight: 'bold' }}> 3. 최근 14일 이내 확진자가 다녀간 장소나 지역(해외여행포함)을 다녀온 사실이 있습니까?</Card.Header>
                        <Card.Body style={{ fontSize: 13 }}>
                            <Form.Group controlId="confirmerContactCd01">
                                <Form.Check inline type="radio" label="가능성이 높다"
                                    name={'confirmerContactCd'}
                                    checked={this.state.confirmerContactCd01}
                                    onChange={(e) => {
                                        this.setState({
                                            confirmerContactCd01: e.target.checked,
                                            confirmerContactCd02: false,
                                            confirmerContactCd03: false
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="confirmerContactCd02">
                                <Form.Check inline type="radio" label="잘 모르겠다"
                                    name={'confirmerContactCd'}
                                    checked={this.state.confirmerContactCd02}
                                    onChange={(e) => {
                                        this.setState({
                                            confirmerContactCd01: false,
                                            confirmerContactCd02: e.target.checked,
                                            confirmerContactCd03: false
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="confirmerContactCd03">
                                <Form.Check inline type="radio" label="없다"
                                    name={'confirmerContactCd'}
                                    checked={this.state.confirmerContactCd03}
                                    onChange={(e) => {
                                        this.setState({
                                            confirmerContactCd01: false,
                                            confirmerContactCd02: false,
                                            confirmerContactCd03: e.target.checked
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" size="sm"
                                    style={{
                                        display: 
                                        this.state.confirmerContactCd01 ? 'inline' : 'none'
                                    }}
                                    name="confirmerContactReason"
                                    placeholder="지역을 입력해 주세요."
                                    value={this.state.hrHealthCheckDto.confirmerContactReason} onChange={this.onChangeHandler.bind(this)}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <Card border="warning" style={{ marginTop: 15 }}>
                        <Card.Header style={{ fontSize: 13, fontWeight: 'bold' }}> 4. 본인 또는 동거인이 방역당국에 의해 현재 자가격리가 이루어지고 있습니까?</Card.Header>
                        <Card.Body style={{ fontSize: 13 }}>
                            <Form.Group controlId="infectedCd01">
                                <Form.Check inline type="radio" label="예"
                                    name={'infectedCd'}
                                    checked={this.state.infectedCd01}
                                    onChange={(e) => {
                                        this.setState({
                                            infectedCd01: e.target.checked,
                                            infectedCd02: false,
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="infectedCd02">
                                <Form.Check inline type="radio" label="아니오"
                                    name={'infectedCd'}
                                    checked={this.state.infectedCd02}
                                    onChange={(e) => {
                                        this.setState({
                                            infectedCd01: false,
                                            infectedCd02: e.target.checked,
                                        });
                                    }}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <Card border="warning" style={{ marginTop: 15 }}>
                        <Card.Header style={{ fontSize: 13, fontWeight: 'bold' }}>5. 기타 공유사항이 있으면 기재 요청드립니다.</Card.Header>
                        <Card.Body style={{ fontSize: 13 }}>
                            <Form.Control as="textarea" rows={3}
                                name="etcReason"
                                value={this.state.hrHealthCheckDto.etcReason} onChange={this.onChangeHandler.bind(this)}
                            />
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>
        </>);
    }
}
export default connect(
    function (state) {
        return { storeState: state }
    },
    function (dispatch) {
        return {
            onIsLoadingTrue: function () {
                dispatch({ type: 'ISLOADING_TRUE' })
            },
            onIsLoadingFalse: function () {
                dispatch({ type: 'ISLOADING_FALSE' })
            }
        }
    }
)(MyHealthCheckDetail)
