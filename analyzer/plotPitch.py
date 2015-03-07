# plotPitch.py

import sys
import analyzeTrack as analyze
import matplotlib.pyplot as plt
import numpy as np


def plotPitch(t):

   	if ".MP3" in t.upper():
		t = analyze.analyzeMP3(t)
	else:
		t = analyze.analyzeID(t)


	pitchMatrix	= parsePitches(t.segments)

def parsePitches(segments):

	pitchMatrix = np.zeros( [len(segments), 12] )

	i = 0
	for segment in segments:
		j = 0
		for pitchVal in segment['pitches']:
			pitchMatrix[i][j] = pitchVal
			j+=1
		i+=1

	return pitchMatrix



if __name__ == '__main__':
    if len(sys.argv) != 2:
        print "Usage: python analyzeTrack.py 'track' \n Track is either a path to an MP3 or a Spotify ID"
    else:
    	t = sys.argv[1]

    	plotPitch(t)
