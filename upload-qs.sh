while getopts p:b: flag
do
        case ${flag} in
                p) profile=${OPTARG};;
        esac
done

profile=${profile:-default}
account=`aws sts --profile ${profile} get-caller-identity | jq --raw-output .Account`
filename='quicksight.json'

echo "Copying QS manifest ${filename} to S3 bucket devopskpi-${account}-etloutput for ${profile} profile..."
aws s3 cp ${filename} s3://devopskpi-${account}-etloutput/ 

exit $?