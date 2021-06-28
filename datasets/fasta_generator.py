import requests
import sys
import os
import shutil

def main():

    input_file = sys.argv[1]
    with open(input_file,'r') as samples_file:
        samples = samples_file.read()
        samples = samples.split('\n')

    try:
        for sample in samples:
            response = requests.get('https://staphopia.emory.edu/api/sample/' + str(sample) +'/contigs/', 
                                    headers={'Authorization': 'Token de28e2ce809de4202d3232bdaab977d0f33a550e'})

            f = open("contig_fasta/" + str(sample) + ".fasta", "w")
            
            results = response.json()['results']
            for r in results:
                contigID = r['contig']
                sequence = r['sequence']
                f.write(">contig" + contigID + " " + str(sample) + "\n")
                f.write(sequence + "\n")
                f.write("\n")
        f.close()
    except:
        err = sys.exc_info()[0]
        print("Error: " + str(err))


if __name__ == "__main__":
    main()