
import requests
import pandas as pd
import os
import time

def main():
    #get all csv file in current directory
    csv_files = os.listdir(".")
    for f in csv_files:   
        print("Processing file:" + f)
        if not f.endswith(".csv"):
            continue;

        AMRgenes = []
        #get sample ID
        sample = f.rstrip(".csv")
        try:
            #get data from csv file
            data = pd.read_csv(f,sep='\t', engine='python',usecols=['Protein identifier', 'Contig id', 'Start', 'Stop',
            'Strand', 'Gene symbol', 'Sequence name', 'Scope', 'Element type','Element subtype', 'Class', 'Subclass', 'Method','Target length',
            'Reference sequence length','% Coverage of reference sequence','% Identity to reference sequence', 'Alignment length','Accession of closest sequence',
            'Name of closest sequence', 'HMM id', 'HMM description'])
        except:
            print("Theres no data in this csv file!")

        for i in range(0, len(data)):
            #get data from three columns "contig ID", "start" and "stop"
            contigID = data['Contig id'][i].lstrip('contig');
            start = int(data['Start'][i]);
            stop = int(data['Stop'][i]);
            
            #fetch API with a specific contig based on its id
            response = requests.get('https://staphopia.emory.edu/api/sample/' + str(sample) +'/contigs/?contig=' + contigID, 
                                        headers={'Authorization': 'Token de28e2ce809de4202d3232bdaab977d0f33a550e'})

            #generate the sequence of the AMR gene
            r = response.json()['results'][0]
            sequence = r['sequence']
            AMRgene = sequence[(start-1):(stop-1)]
            AMRgenes.append(AMRgene)
        
        #rewrite csv file (adding sequence column)
        df = pd.DataFrame(data)
        df['sequence'] = AMRgenes
        df.to_csv(f,sep='\t', index=False)
    print ("Done");
if __name__ == "__main__":
    main()