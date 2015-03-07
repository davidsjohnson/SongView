# analyzeTrack.py
#
# Script to analyze a track, either an MP3 or a track from Spotify
# (via Spotify ID).  

import sys
import numpy as np

from pyechonest import track
from pyechonest import util
from pyechonest import config
config.ECHO_NEST_API_KEY="RRAUM8UKXJEVAKNM1"



def analyzeMP3(filename):
	t = track.track_from_filename(filename) # get track details
	t.get_analysis() # get the analysis info

	return t

def analyzeID(id):

    try:
        t = track.track_from_id(id)
        t.get_analysis()

        return t

    except util.EchoNestAPIError, e:
        print e

def generateCSV(t):

    filename = t.title + ".csv"

    csvArray = np.zeros( (len(t.segments), 13) ) # 12 pitches 1 for loudness

    idx = 0
    for segment in t.segments:

        attrTemp = segment['pitches'] + [segment['loudness_max']]
        attrTemp = np.array(attrTemp)

        csvArray[idx] = attrTemp
        idx += 1

    np.savetxt(filename, csvArray, delimiter=',')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print "Usage: python analyzeTrack.py 'track' 'createCSV' \n Track is either a path to an MP3 or a Spotify ID"
    else:
    	s = sys.argv[1]

    	if ".MP3" in s.upper():
    		t = analyzeMP3(s)
    	else:
    		t = analyzeID(s)

        if s > 2 and sys.argv[2].upper() == 'CREATECSV':
            generateCSV(t)