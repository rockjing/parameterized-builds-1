import React from 'react';
import axios from 'axios';


export default class BuildDialog extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            job: props.jobs[0],
            params: props.jobs[0]['buildParameters']
        };
        this.selectJob = this.selectJob.bind(this);
        this.createParamInput = this.createParamInput.bind(this);
        this.updateParam = this.updateParam.bind(this);
        this.triggerBuild = this.triggerBuild.bind(this);
    }

    selectJob(event) {
        const newJob = this.props.jobs[event.target.value];

        this.setState({
            job: newJob,
            params: newJob.buildParameters
        });
    }

    triggerBuild(){
        let restUrl = this.props.restUrl + "triggerBuild/" + 
            this.state.job.id + "/" + 
            this.props.branch.replace('refs/heads/', "") + "?";

        restUrl += this.state.params.map(param => {
            const paramName = Object.keys(param)[0];
            const paramVal = Object.values(param)[0];

            if (typeof paramVal === "string"){
                return paramName + "=" + paramVal.replace("refs/heads/", "")
            } else if (typeof paramVal === "boolean") {
                return paramName + "=" + paramVal.toString()
            } else {
                return paramName + "=" + paramVal[0]
            }
        }).join("&");

        axios.post(restUrl).then(response => {

        }).catch(err => {

        }).then(() => {
            this.props.closeHandler();
        });
    };

    updateParam(id, val){
        const currentParam = this.state.params[id];
        const paramName = Object.keys(currentParam)[0];
        let newParam = {};
        newParam[paramName] = val;
        this.setState({
            ...this.state,
            params: [
            ...this.state.params.slice(0, id),
            newParam,
            ...this.state.params.slice(id + 1)
        ]});
    }

    createParamInput(id, val){
        if (typeof val === "boolean"){
            return (
                <input id={"build-param-value-" + id} className="checkbox"
                       name={"build-param-value-" + id} defaultChecked={val}
                       type="checkbox" 
                       onChange={(event) => this.updateParam(id, event.target.checked)}/>
            );
        } else if (typeof val === "string") {
            return (
                <input id={"build-param-value-" + id} className="text"
                       name={"build-param-value-" + id} value={val}
                       type="text" 
                       onChange={(event) => this.updateParam(id, event.target.value)}/>
            );
        } else {
            const opts = Object.values(this.state.job.buildParameters[id])[0];
            const options = opts.map(opt => <option value={opt}>{opt}</option>)

            let updateValues = newVal => {
                //remove the chosen value from the options and put it first in the
                //new list. This let's us know the selected value is the first one
                const valIndex = val.findIndex(element => element === newVal);
                return [
                    newVal,
                    ...val.slice(0, valIndex),
                    ...val.slice(valIndex + 1)
                ]
            }

            return (
                <select id={"build-param-value-" + id} className="select"  value={val[0]}
                        onChange={(event) => this.updateParam(id, updateValues(event.target.value))}>
                    {options}
                </select>
            )
        }
    }

    render() {
        const jobOptions = this.props.jobs.map(job => <option value={job.id}>{job.jobName}</option>);
        let paramNum = 0;
        let jobParams = this.state.params.map(param => {
            const paramName = Object.keys(param)[0];
            const paramVal = Object.values(param)[0];
            const paramInput = this.createParamInput(paramNum, paramVal);

            let paramDiv = (
                <div id={"jenkins-form-" + paramNum} className="field-group jenkins-form">
                    <label htmlFor={"build-param-value-" + paramNum}>{paramName}</label>
                    {paramInput}
                </div>
            );
            paramNum++;
            return paramDiv;
        })

        return (
            <section id="build-dialog" className="aui-dialog2 aui-dialog2-medium aui-layer" role="dialog">
                <header className="aui-dialog2-header">
                    <h2 className="aui-dialog2-header-main">Build with Parameters</h2>
                    <a className="aui-dialog2-header-close">
                        <span className="aui-icon aui-icon-small aui-iconfont-close-dialog" 
                              onClick={this.props.closeHandler}>Close</span>
                    </a>
                </header>
                <div className="aui-dialog2-content">
                    <form className="aui" action="" method="post">
                        <select id="job" className="select" name="job" style={{"maxWidth":"initial", "width":"auto"}} 
                                value={this.state.job.id} onChange={this.selectJob}>
                            {jobOptions}
                        </select>
                        <div className="job-params">
                            {jobParams}
                        </div>
                    </form>
                </div>
                <footer className="aui-dialog2-footer">
                <div className="aui-dialog2-footer-actions">
                    <button id="start-build" className="aui-button aui-button-primary" onClick={this.triggerBuild}>Start Build</button>
                </div>
                </footer>
            </section>
        );
    }
}