# recordTrackData.py

import analyzeTrack as analyzer 



if __name__ == '__main__':

    if len(sys.argv) != 2:
        print "Usage: python analyzeTrack.py 'track' \n Track is either a path to an MP3 or a Spotify ID"
    else:
        s = sys.argv[1]

        if ".MP3" in s.upper():
            t = analyzer.analyzeMP3(s)
        else:
            t = analyzeranalyzeID(s)

