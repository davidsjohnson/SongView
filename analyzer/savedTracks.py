import sys
import spotipy
import spotipy.util as util

scope = 'user-library-read'

if len(sys.argv) > 1:
    username = sys.argv[1]
else:
    print "Usage: %s username" % (sys.argv[0],)
    sys.exit()

token = util.prompt_for_user_token(username, scope, client_id="dba1723fffc8466c82ff2a34d9bb1f4f", client_secret="252b55e3a84741e8a0216c1337398293", redirect_uri="http://oac.uvic.ca/davidjohnson")

if token:
    sp = spotipy.Spotify(auth=token)
    results = sp.current_user_saved_tracks()
    for item in results['items']:
        track = item['track']
        print track['name'] + ' - ' + track['artists'][0]['name']
        print track['id']
else:
    print "Can't get token for", username