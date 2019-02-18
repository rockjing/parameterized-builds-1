import React from 'react';


export default class BuildDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            job: props.jobs[0]
        };
        this.selectJob = this.selectJob.bind(this);
        this.createParamInput = this.createParamInput.bind(this);
    }

    selectJob(event) {
        this.setState({
            job: this.props.jobs[event.target.value]
        });
    }

    createParamInput(id, val){
        if (typeof val === "boolean"){
            return (
                <input id={"build-param-value-" + id} className="checkbox"
                       name={"build-param-value-" + id} defaultChecked={val}
                       type="checkbox"/>
            );
        } else if (typeof val === "string") {
            return (
                <input id={"build-param-value-" + id} className="text"
                       name={"build-param-value-" + id} value={val}
                       type="text"/>
            );
        } else {
            const options = val.map(opt => <option value={opt}>{opt}</option>)
            return (
                <select id={"build-param-value-" + id} className="select">
                    {options}
                </select>
            )
        }
    }

    render() {
        const jobOptions = this.props.jobs.map(job => <option value={job.id}>{job.jobName}</option>);
        let paramNum = 0;
        let jobParams = this.state.job.buildParameters.map(param => {
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
                    <button id="start-build" className="aui-button aui-button-primary">Start Build</button>
                </div>
                </footer>
            </section>
        );
    }
}