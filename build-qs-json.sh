while getopts p: flag
do
        case ${flag} in
                p) profile=${OPTARG};;
        esac
done

profile=${profile:-default}

account=`aws sts --profile ${profile} get-caller-identity | jq --raw-output .Account`

cat ./quicksight-template.json | jq --arg URIPrefix "s3://devopskpi-${account}-etloutput/jira.json/" ' .fileLocations[0].URIPrefixes[0] = $URIPrefix' | tee build/quicksight.json