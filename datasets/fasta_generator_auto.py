import requests
import sys


def main():

    try:
        for sample in range(94,194):
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