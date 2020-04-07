import whoosh  as     wh
import pandas  as     pd
import numpy   as     np

from   glob    import glob
from   time    import time, sleep
from   os.path import basename, splitext
from   os      import environ, system

class Index(object):

    def __init__(self, folder):

        """
        initialize index
        > folder : string containg path to cache folder
        """

        self.folder = folder

        self.combo  = pd.DataFrame()
        self.flats  = pd.DataFrame()

        self.buildIndex()

    def buildIndex(self):

        """
        build index of video segments
        """

        self.combo = pd.concat([pd.read_csv(c, sep = '\t') for c in glob(f'{self.folder}/*.combined.*.tsv')]).fillna('').set_index('index') # 10 labels per row

        print(f'Combined Index Contains {self.combo.shape[0]} Entries')

        self.flats = pd.concat([pd.read_csv(c, sep = '\t') for c in glob(f'{self.folder}/*.flatlist.*.tsv')]).fillna('').set_index('index') #  1 label  per row

        for c in glob(f'{self.folder}/*.flatlist.*.tsv'):
            print(splitext(basename(c))[0], '*' if pd.read_csv(c).shape[1] != 7 else ' ', pd.read_csv(c).shape[1], pd.read_csv(c).shape[0])

        print(f'FlatList Index Contains {self.flats.shape[0]} Entries')

    def queryIndex(self, terms, knobs):

        """
        query index for video segment clips
        >  terms : string containing multiple search terms
        >  knobs : dictionary containig option knobs
        < result : dictionary contianig hits
        """

        result = \
        {
            'terms' : terms,
            'knobs' : knobs,
            'clips' :
            [

            ]
        }

      # result['clips'].extend(self.testSearch(terms, knobs))
        result['clips'].extend(self.dumbSearch(terms, knobs))
        result['clips'].extend(self.viniSearch(terms, knobs)) # Vinicio's Magic Here

        return result

    def testSearch(self, terms, knobs):

        clips = [{ 'rank' : 1, 'video' : 'JH3iid1bZ1Q', 'start' :   0, 'end' : 30, 'model' : 'MediaPipe', 'match' : 'swimming, beach, kids', 'probability' : 0.97 },
                 { 'rank' : 2, 'video' : 'btTKApmxrtk', 'start' :  40, 'end' : 35, 'model' : 'SlowFastK', 'match' : 'swimming, beach, girl', 'probability' : 0.94 },
                 { 'rank' : 3, 'video' : 'JH3iid1bZ1Q', 'start' :  55, 'end' : 75, 'model' : 'MediaPipe', 'match' : 'swimming, rocks, kids', 'probability' : 0.92 }]

        return clips

    def dumbSearch(self, terms, knobs):

        clips = []

        tempo = self.combo[self.combo.model != 'Subtitles'] if not knobs['subtitles'] else \
                self.combo

        masks = [tempo['texts'].str.contains(term.lower()) for term in terms.strip().split()]

        hits  =  tempo[np.logical_and.reduce(masks)] if knobs['all_terms'] else \
                 tempo[ np.logical_or.reduce(masks)]

        first = hits.groupby('video').stamp.min()
        media = hits.groupby('video').stamp.median()

        model = hits.groupby('video').model.unique()

        print(model)

        for video, start in first.items():

            clips.append({ 'rank' : len(clips) + 1, 'video' : video, 'start' : start, 'end' : start + 30, 'model' : 'first', 'match' : '?', 'probability' : 0.95 })

        for video, start in media.items():

            clips.append({ 'rank' : len(clips) + 1, 'video' : video, 'start' : start, 'end' : start + 30, 'model' : 'media', 'match' : '?', 'probability' : 0.95 })

        return clips[:5]

    def viniSearch(self, terms, knobs):

        clips = []


        return clips
