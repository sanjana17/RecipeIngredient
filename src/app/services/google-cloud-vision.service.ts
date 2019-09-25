import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class GoogleCloudVisionService {

  constructor(public http: HttpClient) { }

  getLabels(base64Image) {
    const body = {
      'requests': [
        {
          'image': {
            'content': base64Image
          },
          'features' : [
            {
              'type' : 'TYPE_UNSPECIFIED',
              'maxResults' : 50
            }, {
            'type': 'LANDMARK_DETECTION', 'maxResults' : 50
            }, {
            'type' : 'FACE_DETECTION', 'maxResults' : 50
            }, {
            'type' : 'LOGO_DETECTION', 'maxResults' : 50
            }, {
            'type' : 'LABEL_DETECTION', 'maxResults' : 50
            }, {
            'type' : 'TEXT_DETECTION', 'maxResults' : 50
            }, {
            'type' : 'DOCUMENT_TEXT_DETECTION', 'maxResults' : 50
            }, {
            'type' : 'SAFE_SEARCH_DETECTION', 'maxResults' : 50
            }, {
            'type' : 'IMAGE_PROPERTIES', 'maxResults' : 50
            }, {
            'type' : 'CROP_HINTS', 'maxResults' : 50
            }, {
            'type' : 'WEB_DETECTION', 'maxResults' : 50}]
        }
      ]
    };

    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.googleCloudVisionAPIKey, body);
  }

}
