import $ from 'jquery';
import BuildDialog from './build-dialog';
import ReactDOM from 'react-dom';
import axios from 'axios';
import React from 'react';

let closeModal = () => {
    $('#parameterized-builds-modal').remove()
}

const urlRegex = /(.+?)(\/projects\/\w+?\/repos\/\w+?\/)browse.*/
const urlParts = window.location.href.match(urlRegex);
const restBaseUrl = urlParts[1] + "/rest/parameterized-builds/latest" + urlParts[2];

const getJenkinsJobs = (branch, commit) => {
    let restUrl = restBaseUrl + "getJobs?branch=" + branch + "&commit=" + commit;
    return axios.get(restUrl, {
        timeout: 1000 * 60
    });
}

$(document).on('aui-dropdown2-show', '#branch-actions-menu', function () {
    const refData = $('#repository-layout-revision-selector').children(".name");
    const commitRegex = /\"latestCommit\":\"(\w+)\".*/
    const commit = refData.attr("data-revision-ref").match(commitRegex)[1];
    const branch = refData.attr("data-id");
    let jobPromise = getJenkinsJobs(branch, commit);

    $('body,html').append('<div id="parameterized-builds-modal"></div>');
    let $buildTriggerButton = $('.parameterized-build-layout');
    $buildTriggerButton.on('click', () => {
        jobPromise.then(response => {
            let jobs = response.data;
            ReactDOM.render(<BuildDialog closeHandler={closeModal} jobs={jobs} restUrl={restBaseUrl} branch={branch}/>, document.getElementById("parameterized-builds-modal"));
        }).catch(error => {
            console.error("Unable to fetch jobs")
            console.error(error)
        });
    });
});