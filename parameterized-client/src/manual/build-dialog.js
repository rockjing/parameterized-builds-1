import React from 'react';


export default class BuildDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            job: props.jobs[0]
        };
        this.selectJob = this.selectJob.bind(this);
    }

    selectJob(event) {
        this.setState({
            job: this.props.jobs[event.target.value]
        });
    }

    render() {
        const jobOptions = this.props.jobs.map(job => <option value={job.id}>{job.jobName}</option>);
        let paramNum = 0;
        let jobParams = this.state.job.buildParameters.map(param => {
            let paramDiv = (
                <div id={"jenkins-form-" + paramNum} className="field-group jenkins-form">
                    <label htmlFor={"build-param-value-" + paramNum}>{Object.keys(param)[0]}</label>
                    <input id={"build-param-value-" + paramNum} className="text" 
                           name={"build-param-value-" + paramNum} value={Object.values(param)[0]}
                           type="text"/>
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
                                value={this.state.job} onChange={this.selectJob}>
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