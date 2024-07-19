# chatgpt goes to the rescue again :3
import os
import sys
from urllib.parse import urlencode, parse_qsl

import xbmcgui
import xbmcplugin
from xbmcaddon import Addon
from xbmcvfs import translatePath

# Get the plugin URL in plugin:// notation.
URL = sys.argv[0]
# Get a plugin handle as an integer number.
HANDLE = int(sys.argv[1])
# Get addon base path
ADDON_PATH = translatePath(Addon().getAddonInfo('path'))
ICONS_DIR = os.path.join(ADDON_PATH, 'resources', 'images', 'icons')
FANART_DIR = os.path.join(ADDON_PATH, 'resources', 'images', 'fanart')

# Video data
VIDEOS = [
    {
        'channel': 'Bloxeleste',
        'icon': os.path.join(ICONS_DIR, 'bloxeleste.png'),
        'fanart': os.path.join(FANART_DIR, 'bloxeleste.jpg'),
        'channels': [
            {
                'title': 'Bloxeleste',
                'url': 'https://www.bloxelcom.net/bloxcable/hls/Bloxeleste.m3u8',
                'poster': 'https://www.bloxelcom.net/bloxelcom/kodi/bloxposter.png',
                'description': 'Bloxeleste content stream.'
            },
            {
                'title': 'Bloxeleste Anime',
                'url': 'https://www.bloxelcom.net/bloxcable/hls/BloxelesteAnime.m3u8',
                'poster': 'https://www.bloxelcom.net/bloxelcom/kodi/bloxposter.png',
                'description': 'Bloxeleste Anime content stream.'
            },
            {
                'title': 'Bloxeleste Polska',
                'url': 'https://www.bloxelcom.net/bloxcable/hls/BloxelestePL.m3u8',
                'poster': 'https://www.bloxelcom.net/bloxelcom/kodi/bloxposter.png',
                'description': 'Bloxeleste Polska content stream.'
            },
            {
                'title': 'TV10 (Español)',
                'url': 'https://www.bloxelcom.net/bloxcable/hls/TV10.m3u8',
                'poster': 'https://www.bloxelcom.net/bloxelcom/kodi/bloxposter.png',
                'description': 'TV10 content stream.'
            },
            {
                'title': 'TV3',
                'url': 'https://www.bloxelcom.net/bloxcable/hls/TV3.m3u8',
                'poster': 'https://www.bloxelcom.net/bloxelcom/kodi/tv3poster.png',
                'description': 'TV3 content stream.'
            },
            {
                'title': 'Airbenz TV (Français)',
                'url': 'https://www.bloxelcom.net/bloxcable/hls/AirbenzTV.m3u8',
                'poster': 'https://www.bloxelcom.net/bloxelcom/kodi/bloxposter.png',
                'description': 'Airbenz TV content stream.'
            },
        ],
    },
]

def get_url(**kwargs):
    """
    Create a URL for calling the plugin recursively with the given keyword arguments.
    """
    return '{}?{}'.format(URL, urlencode(kwargs))

def get_channels():
    """
    Retrieve the list of video channels.
    """
    return VIDEOS

def get_videos(channel_index):
    """
    Retrieve the list of videos/streams for a given channel.
    """
    return VIDEOS[channel_index]

def list_channels():
    """
    Create the list of channel channels in the Kodi interface.
    """
    xbmcplugin.setPluginCategory(HANDLE, 'Bloxelcom Shows!')
    xbmcplugin.setContent(HANDLE, 'channels')

    channels = get_channels()
    for index, channel_info in enumerate(channels):
        list_item = xbmcgui.ListItem(label=channel_info['channel'])
        list_item.setArt({'icon': channel_info['icon'], 'fanart': channel_info['fanart']})
        
        info_tag = list_item.getVideoInfoTag()
        info_tag.setMediaType('video')
        info_tag.setTitle(channel_info['channel'])
        # This is a custom property, update accordingly if necessary
        list_item.setProperty('channel', channel_info['channel'])

        url = get_url(action='listing', channel_index=index)
        is_folder = True
        xbmcplugin.addDirectoryItem(HANDLE, url, list_item, is_folder)

    xbmcplugin.addSortMethod(HANDLE, xbmcplugin.SORT_METHOD_LABEL_IGNORE_THE)
    xbmcplugin.endOfDirectory(HANDLE)

def list_videos(channel_index):
    """
    Create the list of playable videos in the Kodi interface for a specific channel.
    """
    channel_info = get_videos(channel_index)
    xbmcplugin.setPluginCategory(HANDLE, channel_info['channel'])
    xbmcplugin.setContent(HANDLE, 'channels')

    videos = channel_info['channels']
    for video in videos:
        list_item = xbmcgui.ListItem(label=video['title'])
        list_item.setArt({'poster': video.get('poster', '')})
        
        info_tag = list_item.getVideoInfoTag()
        info_tag.setMediaType('channel')
        info_tag.setTitle(video['title'])
        # This is a custom property, update accordingly if necessary
        list_item.setProperty('channel', channel_info['channel'])
        info_tag.setPlot(video['description'])
        
        list_item.setProperty('IsPlayable', 'true')

        url = get_url(action='play', video=video['url'])
        is_folder = False
        xbmcplugin.addDirectoryItem(HANDLE, url, list_item, is_folder)

    xbmcplugin.addSortMethod(HANDLE, xbmcplugin.SORT_METHOD_LABEL_IGNORE_THE)
    xbmcplugin.addSortMethod(HANDLE, xbmcplugin.SORT_METHOD_VIDEO_YEAR)
    xbmcplugin.endOfDirectory(HANDLE)

def play_video(path):
    """
    Play a video by the provided path.
    """
    play_item = xbmcgui.ListItem(path=path, offscreen=True)
    xbmcplugin.setResolvedUrl(HANDLE, True, listitem=play_item)

def router(paramstring):
    """
    Route the plugin call to the appropriate function based on the provided parameters.
    """
    params = dict(parse_qsl(paramstring))
    if not params:
        list_channels()
    elif params['action'] == 'listing':
        list_videos(int(params['channel_index']))
    elif params['action'] == 'play':
        play_video(params['video'])
    else:
        raise ValueError(f'Invalid paramstring: {paramstring}!')

if __name__ == '__main__':
    router(sys.argv[2][1:])
