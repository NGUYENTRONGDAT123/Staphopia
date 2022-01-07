for assembly in *.fasta
do
    #get the base of the filename
    base=$(basename $assembly .fasta)
    # run AMRFinderPlus with output going to the 
    amrfinder -n $assembly -O Staphylococcus_aureus -o amrfinder_result/$base.csv
done