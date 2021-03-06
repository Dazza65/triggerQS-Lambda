const AWSXRay = require('aws-xray-sdk-core');
const { QuickSightClient, CreateIngestionCommand } = require("@aws-sdk/client-quicksight");
const { v1: uuidv1 } = require('uuid')

const qsClient = AWSXRay.captureAWSv3Client(new QuickSightClient({region: process.env.AWS_REGION}));

const triggerQSRefresh = async (account_id, dataSetId) => {
    try {
        const ingestionId = uuidv1();
        const params = {
            AwsAccountId: account_id,
            DataSetId: dataSetId,
            IngestionId: ingestionId
        };

        const resp = await qsClient.send(new CreateIngestionCommand(params));
        console.log(resp);
        return resp;

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

exports.handler = async (event, context) => {
    const account_id = event.account;
    const jobName = event.detail.jobName;
    const data_set_map = [{jobName: "kpi-job", datasetID: `${account_id}-20210625-01`}];
    
    console.log(`JOB: ${jobName} with run ID ${event.detail.jobRunId} in ${event.detail.state} state.`);

    if( "SUCCEEDED" === event.detail.state ) {
        const dataSetId = data_set_map.find(data_set => data_set.jobName === "kpi-job").datasetID;

        const resp = await triggerQSRefresh(account_id, dataSetId);
        console.log(resp);
    }
};
