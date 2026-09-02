<?php $page = 'webSetModel'; $pageTitle = '模型设置'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded" id="model-block">
    <div class="block-header block-header-default">
        <h3 class="block-title">模型配置</h3>
    </div>
    <div class="block-content block-content-full">
        <form id="model-form">
            <section>
                <h4 class="content-heading border-bottom pt-0 mb-4 pb-2"><i class="si si-cloud me-2 text-primary"></i>API配置</h4>
                <div class="row g-4">
                    <div class="col-4">
                        <label class="form-label" for="pic-api-type-select">模型处理方式</label>
                        <select class="form-select" id="pic-api-type-select">
                            <option value="1">自建</option>
                            <option value="2">云平台</option>
                        </select>
                    </div>
                    <div class="col-4" id="pic-api-url-group">
                        <label class="form-label" for="pic-api-url">自建API地址</label>
                        <input type="text" class="form-control" id="pic-api-url" placeholder="请输入自建API地址">
                    </div>
                    <div class="col-4 d-none" id="pic-api-key-group">
                        <label class="form-label" for="pic-api-key">云平台API密钥</label>
                        <input type="text" class="form-control" id="pic-api-key" placeholder="请输入云平台API密钥">
                    </div>
                </div>
                <div class="alert alert-primary d-none mt-4 mb-0" id="cloud-register-notice" role="alert">
                    <i class="si si-link me-2"></i>云平台注册地址：<a class="alert-link" href="https://cloud.0po.cn/" target="_blank" rel="noopener noreferrer">https://cloud.0po.cn/</a>
                </div>
            </section>
            <hr class="my-4">
            <div class="alert alert-primary py-2 px-3 mb-4 d-none" id="model-tip-alert" role="alert">
                <div class="d-flex align-items-center">
                    <i class="si si-info me-3"></i>
                    <div class="flex-grow-1">不同模型搭配的出图效果和处理速度都不一样，如果你不知道这是干什么的，请保持下面的都是默认选择即可</div>
                    <button type="button" class="btn-close ms-3" id="model-tip-close" aria-label="关闭"></button>
                </div>
            </div>
            <div class="row g-5">
                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-picture me-2 text-primary"></i>证件照制作</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="human-matting-model-select">人像分割模型</label>
                            <select class="form-select" id="human-matting-model-select">
                                <option value="ppMattingV2">ppMattingV2</option>
                                <option value="hivisionModnet">hivisionModnet</option>
                                <option value="modnetPhotographic">modnetPhotographic</option>
                                <option value="rmbg">rmbg</option>
                                <option value="silueta">silueta</option>
                                <option value="birefnet">birefnet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label" for="face-detect-model-select">人脸检测模型</label>
                            <select class="form-select" id="face-detect-model-select">
                                <option value="yunet">yunet</option>
                                <option value="mtcnn">mtcnn</option>
                                <option value="retinaface">retinaface</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-user me-2 text-primary"></i>证件照换装</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="clothes-face-detect-model-select">人脸检测模型</label>
                            <select class="form-select" id="clothes-face-detect-model-select">
                                <option value="yunet">yunet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label" for="clothes-parsing-model-select">人体解析模型</label>
                            <select class="form-select" id="clothes-parsing-model-select">
                                <option value="selfieMulticlass">selfieMulticlass</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-magic-wand me-2 text-primary"></i>智能抠图</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="matting-model-select">抠图模型</label>
                            <select class="form-select" id="matting-model-select">
                                <option value="silueta">silueta</option>
                                <option value="ppMattingV2">ppMattingV2</option>
                                <option value="hivisionModnet">hivisionModnet</option>
                                <option value="modnetPhotographic">modnetPhotographic</option>
                                <option value="rmbg">rmbg</option>
                                <option value="birefnet">birefnet</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-size-fullscreen me-2 text-primary"></i>模糊图片变清晰</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="deblur-model-select">图片增强模型</label>
                            <select class="form-select" id="deblur-model-select">
                                <option value="realEsrgan">realEsrgan</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-drop me-2 text-primary"></i>黑白照片上色</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="colourize-model-select">上色模型</label>
                            <select class="form-select" id="colourize-model-select">
                                <option value="ddcolor">ddcolor</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-emoticon-smile me-2 text-primary"></i>动漫风照片</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="cartoon-model-select">动漫风模型</label>
                            <select class="form-select" id="cartoon-model-select">
                                <option value="cartoon">cartoon</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-badge me-2 text-primary"></i>美式证件照</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="american-human-matting-model-select">人像分割模型</label>
                            <select class="form-select" id="american-human-matting-model-select">
                                <option value="ppMattingV2">ppMattingV2</option>
                                <option value="hivisionModnet">hivisionModnet</option>
                                <option value="modnetPhotographic">modnetPhotographic</option>
                                <option value="rmbg">rmbg</option>
                                <option value="silueta">silueta</option>
                                <option value="birefnet">birefnet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label" for="american-face-detect-model-select">人脸检测模型</label>
                            <select class="form-select" id="american-face-detect-model-select">
                                <option value="yunet">yunet</option>
                                <option value="mtcnn">mtcnn</option>
                                <option value="retinaface">retinaface</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-grid me-2 text-primary"></i>社交媒体模板照</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="template-human-matting-model-select">人像分割模型</label>
                            <select class="form-select" id="template-human-matting-model-select">
                                <option value="ppMattingV2">ppMattingV2</option>
                                <option value="hivisionModnet">hivisionModnet</option>
                                <option value="modnetPhotographic">modnetPhotographic</option>
                                <option value="rmbg">rmbg</option>
                                <option value="silueta">silueta</option>
                                <option value="birefnet">birefnet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label" for="template-face-detect-model-select">人脸检测模型</label>
                            <select class="form-select" id="template-face-detect-model-select">
                                <option value="yunet">yunet</option>
                                <option value="mtcnn">mtcnn</option>
                                <option value="retinaface">retinaface</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section class="col-6">
                    <h4 class="content-heading border-bottom mb-4 pb-2"><i class="si si-heart me-2 text-primary"></i>情侣红底照</h4>
                    <div class="row g-4">
                        <div class="col-6">
                            <label class="form-label" for="couple-human-matting-model-select">人像分割模型</label>
                            <select class="form-select" id="couple-human-matting-model-select">
                                <option value="ppMattingV2">ppMattingV2</option>
                                <option value="hivisionModnet">hivisionModnet</option>
                                <option value="modnetPhotographic">modnetPhotographic</option>
                                <option value="rmbg">rmbg</option>
                                <option value="silueta">silueta</option>
                                <option value="birefnet">birefnet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label" for="couple-face-detect-model-select">人脸检测模型</label>
                            <select class="form-select" id="couple-face-detect-model-select">
                                <option value="yunet">yunet</option>
                                <option value="mtcnn">mtcnn</option>
                                <option value="retinaface">retinaface</option>
                            </select>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    </div>
    <div class="block-content block-content-full border-top text-end">
        <button type="button" class="btn btn-primary px-4" id="model-save">保存配置</button>
    </div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
