/**
 * Created by zhiyuan.huang@ddder.com on 17/5/10.
 *
 * 在JSAPI 暂时不支持ES6 Class spec 的情况下，提供一个基础的面向Javascript 对象编程的方式
 */

'use strict';

const _ = require('lodash');

function BaseClass() {}

function create(BaseFactory, props) {
    if (_.isUndefined(props)) {
        props = BaseFactory;
        BaseFactory = null;
    }

    if (!_.isFunction(BaseFactory)) {
        BaseFactory = BaseClass;
    }

    let SubClass = function(...args) {
        // TODO: need testing
        if (!(this instanceof SubClass)) return new SubClass(...args);

        BaseFactory.apply(this, args);

        if (this.constructor === SubClass && this.initialize) {
            this.initialize.apply(this, args);
        }
    };

    let proto = SubClass.prototype = Object.create(BaseFactory.prototype);
    SubClass.prototype.constructor = SubClass;

    if (_.isObject(props)) {
        let Implements = props.Implements;
        if (Array.isArray(Implements)) {
            implementMixinToProto(proto, Implements);
            delete props.Implements;
        }

        let Statics = props.Statics;
        if (_.isObject(Statics)) {
            combineMixinToClass(SubClass, Statics);
            delete props.Statics;
        }

        combineMixinToProto(proto, props);
    }

    return classify(SubClass);
}

function classify(cls) {
    cls.extend = function(props) {
        return create(cls, props);
    };

    cls.implement = function(props) {
        implementMixinToProto(cls.prototype, props);
    };

    return cls;
}

function implementMixinToProto(proto, Implements) {
    for (let mixin of Implements) {
        combineMixinToProto(proto, mixin);
    }
}

function combineMixinToProto(proto, mixin) {
    if (!mixin) return proto;

    for (let key of Object.keys(mixin)) {
        let value = mixin[key];
        if (!_.isFunction(value)) {
            proto[key] = value;
        } else {
            proto[key] = (function(oriFunc) {
                function _super(...args) {
                    return (oriFunc || _.noop).apply(this, args);
                }

                return function(...args) {
                    let __super = this._super;
                    let returnValue;

                    this._super = _super;
                    returnValue = value.apply( this, args );
                    this._super = __super;

                    return returnValue;
                }
            })(proto[key]);
        }
    }
}

function combineMixinToClass(factory, statics) {
    _.assign(factory, statics);
}

exports.create = create;
exports.classify = classify;